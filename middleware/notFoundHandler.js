/**
 * Middleware to handle 404 Not Found errors for routes that don't exist
 * This helps standardize 404 responses across the API
 */
const notFoundHandler = (req, res, next) => {
  // Prepare a clean response for non-existent endpoints
  const resourceType = req.path.split('/')[1] || 'resource';
  const message = `The requested ${resourceType} could not be found`;

  // Set CORS headers to ensure errors are properly received by clients
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Return standardized 404 response
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message,
    path: req.originalUrl
  });
};

module.exports = notFoundHandler; 