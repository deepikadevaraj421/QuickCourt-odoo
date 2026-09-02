const HttpError = require('../../shared/utils/httpError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PUBLIC_ROLES = ['USER', 'OWNER'];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function validateRegister(body) {
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const role = String(body.role || 'USER').toUpperCase();

  if (!name || !email || !password) throw new HttpError(400, 'Name, email and password are required');
  if (name.length < 2) throw new HttpError(400, 'Name must be at least 2 characters');
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Please enter a valid email address');
  if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters');
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new HttpError(400, 'Password must contain at least one letter and one number');
  }
  if (!PUBLIC_ROLES.includes(role)) throw new HttpError(400, 'Role must be USER or OWNER');

  return { name, email, password, role };
}

function validateLogin(body) {
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  if (!email || !password) throw new HttpError(400, 'Email and password are required');
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Please enter a valid email address');
  return { email, password };
}

function validateVerifyOtp(body) {
  const email = normalizeEmail(body.email);
  const otp = String(body.otp || '').trim();
  if (!email || !otp) throw new HttpError(400, 'Email and OTP are required');
  if (!/^\d{6}$/.test(otp)) throw new HttpError(400, 'OTP must be a 6-digit code');
  return { email, otp };
}

function validateEmailOnly(body) {
  const email = normalizeEmail(body.email);
  if (!email) throw new HttpError(400, 'Email is required');
  if (!EMAIL_RE.test(email)) throw new HttpError(400, 'Please enter a valid email address');
  return { email };
}

module.exports = { validateRegister, validateLogin, validateVerifyOtp, validateEmailOnly };
