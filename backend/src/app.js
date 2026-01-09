const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');


// Import Custom Middlewares & Utilities
const errorHandler = require('./middlewares/error.middleware');
const { globalLimiter } = require('./middlewares/rateLimit.middleware');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const invoiceRoutes = require('./routes/invoice.routes');

const app = express();

// 1. SECURITY MIDDLEWARE
// ContentSecurityPolicy must be false to show images from your local server
app.use(helmet({ 
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" } // ALLOWS images to be loaded by frontend
})); 

// Fixed CORS
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
})); 

app.use(xss()); 
app.use(hpp()); 

// 2. LOGGING & PARSING
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev')); 
}
app.use(cookieParser()); 
app.use(express.json()); 

// 3. STATIC FILES (FIXED PATH)
// Removed the '..' because your uploads folder is inside the backend directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. RATE LIMITING
app.use('/api/', globalLimiter);

// --- ROOT ROUTER ---
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Airbnb Clone API',
    documentation: 'Use /api/v1 for all endpoints'
  });
});

// 5. MOUNT ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

// 6. 404 HANDLER
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// 7. ERROR HANDLING
app.use(errorHandler);

module.exports = app;