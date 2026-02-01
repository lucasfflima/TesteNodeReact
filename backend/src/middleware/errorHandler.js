// Centralized error handler
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const isServerError = status >= 500;
  const message = isServerError ? 'Internal server error' : err.message || 'Unexpected error';

  // Basic structured log; replace with pino/winston if desired
  // eslint-disable-next-line no-console
  console.error({
    requestId: req.id,
    path: req.originalUrl,
    method: req.method,
    status,
    message: err.message,
    stack: err.stack,
  });

  res.status(status).json({
    error: message,
    requestId: req.id,
  });
};

module.exports = errorHandler;