const express = require('express');
const router = express.Router();
const { CRM } = require('../models');
const authMiddleware = require('../middleware/authMiddleware'); // ✅
const checkSubscription = require('../middleware/checkSubscription');


router.post('/create', checkSubscription, async (req, res) => {
  // your logic
});
// ✅ Get all CRM records for the logged-in user's company
router.get('/', authMiddleware, async (req, res) => {
  try {
    const crms = await CRM.findAll({
      where: { companyId: req.user.companyId }
    });
    res.json(crms);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Create a new CRM record
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes, assignedTo } = req.body;
    const newCRM = await CRM.create({
      name,
      email,
      phone,
      company,
      status,
      notes,
      assignedTo,
      companyId: req.user.companyId,
    });
    res.status(201).json(newCRM);
  } catch (error) {
    res.status(400).json({ error: 'Invalid CRM data' });
  }
});

// ✅ Update a CRM record
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, email, phone, company, status, notes, assignedTo } = req.body;
    const crm = await CRM.findOne({
      where: {
        id: req.params.id,
        companyId: req.user.companyId
      }
    });

    if (!crm) return res.status(404).json({ error: 'CRM record not found' });

    await crm.update({ name, email, phone, company, status, notes, assignedTo });
    res.json(crm);
  } catch (error) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// ✅ Delete a CRM record
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const crm = await CRM.findOne({
      where: {
        id: req.params.id,
        companyId: req.user.companyId
      }
    });

    if (!crm) return res.status(404).json({ error: 'CRM record not found' });

    await crm.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Deletion failed' });
  }
});

module.exports = router;
