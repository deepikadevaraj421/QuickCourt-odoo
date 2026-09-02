const { verifyToken } = require('../utils/jwt');
const authService = require('../services/authService');

function extractToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7).trim();
  return null;
}

async function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required', code: 'NO_TOKEN' });
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch (err) {
    const expired = err.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      message: expired ? 'Session expired. Please log in again.' : 'Invalid authentication token',
      code: expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN'
    });
  }

  try {
    const user = await authService.getUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Account no longer exists', code: 'USER_NOT_FOUND' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Account not verified', code: 'ACCOUNT_NOT_VERIFIED' });
    }
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required', code: 'NO_TOKEN' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this resource',
        code: 'FORBIDDEN_ROLE'
      });
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
