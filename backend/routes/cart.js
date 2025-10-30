const express = require('express');
const { CartItem } = require('../models/CartItem.js');

const router = express.Router();

// GET /api/cart - Get cart with items and total
router.get('/', async (req, res) => {
  try {
    const cartSummary = await CartItem.getCartSummary();
    
    res.json({
      success: true,
      data: cartSummary
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Other routes remain the same...

module.exports = router;