const authService = require('../services/authService');
const {
  validateRegister,
  validateLogin,
  validateVerifyOtp,
  validateEmailOnly
} = require('../validators/authValidators');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const authController = {
  register: wrap(async (req, res) => {
    const input = validateRegister(req.body);
    const result = await authService.register(input);
    res.status(201).json({
      success: true,
      message: 'Registration successful. A verification code has been sent to your email.',
      data: result
    });
  }),

  verifyOtp: wrap(async (req, res) => {
    const input = validateVerifyOtp(req.body);
    const result = await authService.verifyOtp(input);
    res.json({ success: true, message: 'Email verified successfully', data: result });
  }),

  resendOtp: wrap(async (req, res) => {
    const input = validateEmailOnly(req.body);
    const result = await authService.resendOtp(input);
    res.json({ success: true, message: 'A new verification code has been sent', data: result });
  }),

  login: wrap(async (req, res) => {
    const input = validateLogin(req.body);
    const result = await authService.login(input);
    res.json({ success: true, message: 'Login successful', data: result });
  }),

  me: wrap(async (req, res) => {
    res.json({ success: true, message: 'Current user', data: { user: req.user } });
  }),

  logout: wrap(async (req, res) => {
    // Stateless JWT: the client discards the token. Endpoint exists so the
    // frontend has a single place to hook server-side invalidation later.
    res.json({ success: true, message: 'Logged out', data: null });
  })
};

module.exports = authController;
