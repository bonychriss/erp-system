const express = require('express');
const router = express.Router();
const { Inventory } = require('../models'); // Change if you have a separate Logistics model
const authMiddleware = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');
const roleMiddleware = require('../middleware/roleMiddleware');

// 🚚 Create a logistics item
router.post('/:companyId', authMiddleware, checkSubscription, roleMiddleware('Logistics'), async (req, res) => {
  try {
    const { companyId } = req.params;
    const { itemName, quantity, status, destination } = req.body;

    const newItem = await Inventory.create({
      itemName,
      quantity,
      status,
      destination,
      companyId,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create logistics item' });
  }
});

// 📦 Get all logistics items for a company
router.get('/:companyId', authMiddleware, checkSubscription, roleMiddleware('Logistics'), async (req, res) => {
  try {
    const { companyId } = req.params;
    const items = await Inventory.findAll({ where: { companyId } });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logistics items' });
  }
});

// ✏️ Update a logistics item
router.put('/:companyId/:id', authMiddleware, checkSubscription, roleMiddleware('Logistics'), async (req, res) => {
  try {
    const { companyId, id } = req.params;
    const { itemName, quantity, status, destination } = req.body;

    const item = await Inventory.findOne({ where: { id, companyId } });

    if (!item) {
      return res.status(404).json({ error: 'Logistics item not found' });
    }

    await item.update({ itemName, quantity, status, destination });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update logistics item' });
  }
});

// 🗑️ Delete a logistics item
router.delete('/:companyId/:id', authMiddleware, checkSubscription, roleMiddleware('Logistics'), async (req, res) => {
  try {
    const { companyId, id } = req.params;

    const item = await Inventory.findOne({ where: { id, companyId } });

    if (!item) {
      return res.status(404).json({ error: 'Logistics item not found' });
    }

    await item.destroy();
    res.json({ message: 'Logistics item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete logistics item' });
  }
});

module.exports = router;
