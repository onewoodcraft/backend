/**
 * Middleware to validate request data against a schema
 * Helps prevent 400 Bad Request errors by validating input before processing
 * 
 * @param {Object} schema - Joi or Zod schema to validate against
 * @returns {Function} Express middleware function
 */
const validateResource = (schema) => (req, res, next) => {
  try {
    // Combine all sources of input data
    const dataToValidate = {
      body: req.body,
      query: req.query,
      params: req.params
    };

    // Validate against schema
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown properties
      allowUnknown: true  // Allow unknown properties in the original object
    });

    if (error) {
      // Format validation errors for frontend consumption
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation Error',
        errors
      });
    }

    // Replace req properties with validated values
    req.body = value.body;
    req.query = value.query;
    req.params = value.params;

    return next();
  } catch (error) {
    console.error('Validation middleware error:', error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Internal Server Error',
      error: 'Validation system error'
    });
  }
};

module.exports = validateResource; 