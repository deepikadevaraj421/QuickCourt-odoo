const bcrypt = require('bcryptjs');
const prisma = require('../../config/prisma');
const { otpExpiryMinutes, otpMaxAttempts } = require('../../config/env');
const HttpError = require('../../shared/utils/httpError');
const emailService = require('../../shared/services/emailService');
const { generateOtpCode, hashOtp, otpMatches } = require('../utils/otp');
const { signToken } = require('../utils/jwt');

const OTP_PURPOSE = 'VERIFY_EMAIL';
const RESEND_COOLDOWN_SECONDS = 30;

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt
  };
}

async function issueOtp(user) {
  const latest = await prisma.otpToken.findFirst({
    where: { userId: user.id, purpose: OTP_PURPOSE, usedAt: null },
    orderBy: { createdAt: 'desc' }
  });
  if (latest && Date.now() - latest.createdAt.getTime() < RESEND_COOLDOWN_SECONDS * 1000) {
    throw new HttpError(429, `Please wait ${RESEND_COOLDOWN_SECONDS} seconds before requesting a new code`);
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60 * 1000);

  await prisma.$transaction([
    // Invalidate any earlier unused codes so only the newest one is valid.
    prisma.otpToken.updateMany({
      where: { userId: user.id, purpose: OTP_PURPOSE, usedAt: null },
      data: { usedAt: new Date() }
    }),
    prisma.otpToken.create({
      data: { userId: user.id, purpose: OTP_PURPOSE, codeHash: hashOtp(code, user.id), expiresAt }
    })
  ]);

  await emailService.sendOtpEmail(user.email, code, otpExpiryMinutes);
  return { expiresAt };
}

async function register({ name, email, password, role }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && existing.isVerified) {
    throw new HttpError(409, 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  let user;
  if (existing) {
    // Unverified account re-registering: refresh details and re-send OTP.
    user = await prisma.user.update({ where: { id: existing.id }, data: { name, passwordHash, role } });
  } else {
    user = await prisma.user.create({ data: { name, email, passwordHash, role } });
  }

  const { expiresAt } = await issueOtp(user);
  return { user: toPublicUser(user), otpExpiresAt: expiresAt };
}

async function verifyOtp({ email, otp }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(404, 'Account not found');
  if (user.isVerified) throw new HttpError(400, 'Account is already verified. Please log in.');

  const token = await prisma.otpToken.findFirst({
    where: { userId: user.id, purpose: OTP_PURPOSE, usedAt: null },
    orderBy: { createdAt: 'desc' }
  });
  if (!token) throw new HttpError(400, 'No active OTP. Please request a new code.');
  if (token.expiresAt.getTime() < Date.now()) {
    await prisma.otpToken.update({ where: { id: token.id }, data: { usedAt: new Date() } });
    throw new HttpError(400, 'OTP has expired. Please request a new code.');
  }
  if (token.attempts >= otpMaxAttempts) {
    await prisma.otpToken.update({ where: { id: token.id }, data: { usedAt: new Date() } });
    throw new HttpError(429, 'Too many incorrect attempts. Please request a new code.');
  }
  if (!otpMatches(otp, user.id, token.codeHash)) {
    await prisma.otpToken.update({ where: { id: token.id }, data: { attempts: { increment: 1 } } });
    throw new HttpError(400, 'Invalid OTP. Please check the code and try again.');
  }

  const [verifiedUser] = await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { isVerified: true } }),
    prisma.otpToken.update({ where: { id: token.id }, data: { usedAt: new Date() } })
  ]);

  return { token: signToken(verifiedUser), user: toPublicUser(verifiedUser) };
}

async function resendOtp({ email }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(404, 'Account not found');
  if (user.isVerified) throw new HttpError(400, 'Account is already verified. Please log in.');
  const { expiresAt } = await issueOtp(user);
  return { otpExpiresAt: expiresAt };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new HttpError(401, 'Invalid email or password');

  const passwordOk = await bcrypt.compare(password, user.passwordHash);
  if (!passwordOk) throw new HttpError(401, 'Invalid email or password');

  if (!user.isVerified) {
    throw new HttpError(403, 'Account not verified. Please verify your email with the OTP.', 'ACCOUNT_NOT_VERIFIED');
  }

  return { token: signToken(user), user: toPublicUser(user) };
}

async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  return user ? toPublicUser(user) : null;
}

module.exports = { register, verifyOtp, resendOtp, login, getUserById, toPublicUser };
