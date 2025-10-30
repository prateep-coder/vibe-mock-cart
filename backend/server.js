const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Security imports
const { 
  apiLimiter, 
  authLimiter, 
  helmetConfig, 
  corsOptions 
} = require('./config/security');

const { 
  validateRequest, 
  sqlInjectionProtection, 
  sanitizeInputs, 
  xssProtection 
} = require('./middleware/security');

const { 
  validateProductId, 
  validateQuantity, 
  validateCheckoutData 
} = require('./middleware/validation');

// Route imports
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const { initializeDatabase } = require('./db/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ========================
// SECURITY MIDDLEWARE
// ========================

// Helmet security headers
app.use(helmetConfig);

// XSS protection
app.use(xssProtection);

// Rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

// CORS with security
app.use(cors(corsOptions));

// Request logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body parsing with security limits
app.use(express.json({ 
  limit: '1mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf);
    } catch (e) {
      res.status(400).json({ error: 'Invalid JSON' });
      throw new Error('Invalid JSON');
    }
  }
}));

// Security validation middlewares
app.use(validateRequest);
app.use(sqlInjectionProtection);
app.use(sanitizeInputs);

// ========================
// DATABASE INITIALIZATION
// ========================

initializeDatabase().catch(console.error);

// ========================
// ROUTES WITH VALIDATION
// ========================

// Products routes (read-only, less validation)
app.use('/api/products', productRoutes);

// Cart routes with validation
app.use('/api/cart', 
  validateProductId, 
  validateQuantity, 
  cartRoutes
);

// Checkout with specific validation
app.post('/api/cart/checkout', validateCheckoutData);

// ========================
// HEALTH & STATUS ENDPOINTS
// ========================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Vibe Commerce API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    security: 'enabled'
  });
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    server_time: new Date().toISOString(),
    uptime: process.uptime(),
    memory_usage: process.memoryUsage(),
    security_features: [
      'helmet-headers',
      'rate-limiting', 
      'sql-injection-protection',
      'xss-protection',
      'input-sanitization',
      'cors-validation'
    ]
  });
});

// ========================
// ERROR HANDLING
// ========================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }

  // Development error response
  res.status(500).json({ 
    success: false,
    error: err.message,
    stack: err.stack 
  });
});

// ========================
// SERVER START
// ========================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 Security Features:`);
  console.log(`   ✓ Helmet Security Headers`);
  console.log(`   ✓ Rate Limiting (100 requests/15min)`);
  console.log(`   ✓ SQL Injection Protection`);
  console.log(`   ✓ XSS Protection`);
  console.log(`   ✓ Input Sanitization`);
  console.log(`   ✓ CORS Validation`);
});

module.exports = app;