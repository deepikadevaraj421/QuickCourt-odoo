const crypto = require('crypto');
const { jwtSecret } = require('../../config/env');

function generateOtpCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function hashOtp(code, userId) {
  return crypto.createHmac('sha256', jwtSecret).update(`${userId}:${code}`).digest('hex');
}

function otpMatches(code, userId, hash) {
  const candidate = Buffer.from(hashOtp(code, userId));
  const stored = Buffer.from(hash);
  return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
}

module.exports = { generateOtpCode, hashOtp, otpMatches };
