const { secret } = require('../config/secret');
const ApiError = require('../errors/api-error');
const handleCastError = require('../errors/handle-cast-error');
const handleValidationError = require('../errors/handle-validation-error');


const globalErrorHandler = (error, req, res, next) => {
  let statusCode = 500
  let message = 'Something went wrong !'
  let errorMessages = []


  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode
    message = error.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  } else if (error instanceof Error) {
    message = error?.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  }

  // Set CORS headers to ensure errors are properly received by clients
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack:secret.env !== 'production' ? error?.stack : undefined,
  })
}

module.exports = globalErrorHandler;
