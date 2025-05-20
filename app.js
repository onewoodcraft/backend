// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

// Apply routes
app.use('/api', routes);

// Handle 404 errors for routes not found
app.use(notFoundHandler);

// Global error handler for all other errors
app.use(errorHandler); 