const createError = require('http-errors');

/**
 * Global error handler middleware with improved error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Set default status code and error message
  let statusCode = err.status || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation Error';
    
    // Extract validation errors
    if (err.errors) {
      Object.keys(err.errors).forEach(key => {
        errors.push({
          field: key,
          message: err.errors[key].message
        });
      });
    }
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ID)
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate key error';
    
    // Extract the duplicated field
    const field = Object.keys(err.keyValue)[0];
    errors.push({
      field,
      message: `${field} already exists`
    });
  } else if (err.name === 'JsonWebTokenError') {
    // JWT errors
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Set CORS headers to ensure errors are properly received by clients
  // This is crucial for cross-origin requests to receive error details
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Return the error response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler; 