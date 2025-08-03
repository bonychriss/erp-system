// routes/sales.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const checkSubscription = require('../middleware/subscription');
const roleMiddleware = require('../middleware/roleMiddleware'); // Make sure path is correct

// POST /sales/:companyId
router.post(
  '/:companyId',
  authMiddleware,          // First verify authentication
  checkSubscription,       // Then check subscription
  roleMiddleware('Sales'), // Then verify role - pass 'Sales' as argument
  async (req, res) => {    // Then your route handler
    try {
      // Your sales logic here
      // Access companyId from params: req.params.companyId
      // Access user data from req.user
      
      res.status(200).json({ 
        success: true,
        message: 'Sales operation completed successfully'
      });
    } catch (error) {
      console.error('Sales Error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to process sales operation',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);

module.exports = router;