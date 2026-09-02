const { isProduction } = require('../../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 && isProduction ? 'Internal server error' : err.message,
    code: err.code
  });
}

module.exports = errorHandler;
