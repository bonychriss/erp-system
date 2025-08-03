// routes/procurementRoutes.js

const express = require('express');
const router = express.Router();
const { Procurement } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// CREATE procurement (login required)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { item, quantity, cost, status, requestedBy } = req.body;

    if (!item || !quantity || !cost) {
      return res.status(400).json({ message: 'Item, quantity, and cost are required' });
    }

    const newProcurement = await Procurement.create({
      companyId: req.user.companyId,
      item,
      quantity,
      cost,
      status: status?.toLowerCase() || 'pending',
      requestedBy: requestedBy || null,
    });

    res.status(201).json({ message: 'Procurement created', data: newProcurement });
  } catch (error) {
    console.error('Procurement creation error:', error);
    res.status(500).json({ message: 'Failed to create procurement', error: error.message });
  }
});

// GET all procurements for logged-in user's company
router.get('/', authMiddleware, async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const records = await Procurement.findAll({
      where: { companyId },
      order: [['createdAt', 'DESC']],
    });

    res.json(records);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch procurement records', error: error.message });
  }
});

// UPDATE procurement by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { item, quantity, cost, status } = req.body;

    const record = await Procurement.findByPk(id);

    if (!record || record.companyId !== req.user.companyId) {
      return res.status(404).json({ message: 'Procurement not found or unauthorized' });
    }

    record.item = item || record.item;
    record.quantity = quantity || record.quantity;
    record.cost = cost || record.cost;
    record.status = status?.toLowerCase() || record.status;

    await record.save();

    res.json({ message: 'Procurement updated', data: record });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Failed to update procurement', error: error.message });
  }
});

// DELETE procurement by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Procurement.destroy({
      where: { id, companyId: req.user.companyId },
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Procurement not found or unauthorized' });
    }

    res.json({ message: 'Procurement deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete procurement', error: error.message });
  }
});

module.exports = router;
