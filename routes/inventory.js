// routes/inventory.js
const express = require('express');
const router = express.Router();
const { Inventory } = require('../models');

// ✅ Correctly import each middleware from its own file
const authMiddleware = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Create a new inventory item
router.post('/:companyId', authMiddleware, checkSubscription, roleMiddleware('Inventory'), async (req, res) => {
  const { productName, quantity, category } = req.body;
  const { companyId } = req.params;

  try {
    const item = await Inventory.create({ productName, quantity, category, companyId });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// ✅ Get all inventory items for a company
router.get('/:companyId', authMiddleware, checkSubscription, roleMiddleware('Inventory'), async (req, res) => {
  const { companyId } = req.params;

  try {
    const items = await Inventory.findAll({ where: { companyId } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

module.exports = router;
