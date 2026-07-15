const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = {};
    Object.values(err.errors).forEach(e => { errors[e.path] = e.message; });
    return res.status(400).json({ status: 400, error: 'Validation Failed', errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ status: 400, error: 'Bad Request', message: `${field} already in use` });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ status: 401, error: 'Unauthorized', message: 'Invalid token' });

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    status,
    error:   err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
  });
};

export default errorHandler;
