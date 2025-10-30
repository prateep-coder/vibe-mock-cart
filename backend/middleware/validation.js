// Product validation
const validateProductId = (req, res, next) => {
  const { productId } = req.body;
  
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Valid productId is required'
    });
  }
  
  // UUID validation (if using UUIDs)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(productId) && productId.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Invalid productId format'
    });
  }
  
  next();
};

// Quantity validation
const validateQuantity = (req, res, next) => {
  const { quantity } = req.body;
  
  if (quantity && (typeof quantity !== 'number' || quantity < 1 || quantity > 100)) {
    return res.status(400).json({
      success: false,
      error: 'Quantity must be a number between 1 and 100'
    });
  }
  
  next();
};

// Checkout data validation
const validateCheckoutData = (req, res, next) => {
  const { customerInfo } = req.body;
  
  if (!customerInfo) {
    return res.status(400).json({
      success: false,
      error: 'customerInfo is required'
    });
  }
  
  const { name, email, address, city, zipCode } = customerInfo;
  
  // Name validation
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({
      success: false,
      error: 'Valid name is required (2-100 characters)'
    });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required'
    });
  }
  
  // Optional address validation
  if (address && (typeof address !== 'string' || address.length > 200)) {
    return res.status(400).json({
      success: false,
      error: 'Address must be a string with max 200 characters'
    });
  }
  
  next();
};

// Price validation (for product creation/updates)
const validatePrice = (req, res, next) => {
  const { price } = req.body;
  
  if (price && (typeof price !== 'number' || price < 0 || price > 100000)) {
    return res.status(400).json({
      success: false,
      error: 'Price must be a number between 0 and 100000'
    });
  }
  
  next();
};

module.exports = {
  validateProductId,
  validateQuantity,
  validateCheckoutData,
  validatePrice
};