// Import necessary packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();

// CORS Configuration
const allowedOrigins = [
  'https://admin-sigma-ruby.vercel.app',
  'https://frontend-brown-sigma.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

// Configure CORS with proper options
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Security headers
app.use(helmet());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const routes = require('./routes');

// Apply routes
app.use('/api', routes);

// Handle preflight requests for all routes
app.options('*', cors());

// Handle 404 errors for routes not found
app.use(notFoundHandler);

// Global error handler for all other errors
app.use(errorHandler);

module.exports = app; 