const { sanitizeInput, detectSQLInjection } = require('../config/security');

// Request validation middleware
const validateRequest = (req, res, next) => {
  // Check content type for POST/PUT requests
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type must be application/json'
      });
    }
  }

  // Payload size check (1MB limit)
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 1000000) {
    return res.status(413).json({
      success: false,
      error: 'Payload too large'
    });
  }

  next();
};

// SQL injection protection middleware
const sqlInjectionProtection = (req, res, next) => {
  const checkObject = (obj) => {
    for (let key in obj) {
      if (detectSQLInjection(obj[key])) {
        console.warn('Potential SQL injection attempt detected', {
          ip: req.ip,
          method: req.method,
          url: req.originalUrl,
          key: key
        });
        return true;
      }
    }
    return false;
  };

  if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid input detected'
    });
  }

  next();
};

// Input sanitization middleware
const sanitizeInputs = (req, res, next) => {
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = sanitizeInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// XSS protection headers
const xssProtection = (req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

module.exports = {
  validateRequest,
  sqlInjectionProtection,
  sanitizeInputs,
  xssProtection
};