const express = require('express');
const router = express.Router();
const { Procurement } = require('../models');

// ➕ CREATE procurement
router.post('/', async (req, res) => {
  try {
    const data = await Procurement.create(req.body);
    res.json({ message: 'Procurement created', data });
  } catch (error) {
    res.status(400).json({ message: 'Error creating procurement', error: error.message });
  }
});

// 📥 READ all procurements for a company
router.get('/:companyId', async (req, res) => {
  try {
    const data = await Procurement.findAll({ where: { companyId: req.params.companyId } });
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching procurements', error: error.message });
  }
});

// ✏️ UPDATE procurement
router.put('/:id', async (req, res) => {
  try {
    const procurement = await Procurement.findByPk(req.params.id);
    if (!procurement) return res.status(404).json({ message: 'Procurement not found' });

    await procurement.update(req.body);
    res.json({ message: 'Procurement updated', data: procurement });
  } catch (error) {
    res.status(400).json({ message: 'Error updating procurement', error: error.message });
  }
});

// ❌ DELETE procurement
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Procurement.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Procurement not found' });

    res.json({ message: 'Procurement deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting procurement', error: error.message });
  }
});

module.exports = router;
