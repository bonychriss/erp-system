const express = require('express');
const router = express.Router();
const { Invoice } = require('../models');
const auth = require('../middleware/authMiddleware');
const checkSub = require('../middleware/checkSubscription');

// Create invoice
router.post('/', auth, checkSub, async (req, res) => {
  try {
    const { clientName, invoiceNumber, issueDate, dueDate, status, amount } = req.body;
    const newInvoice = await Invoice.create({
      clientName,
      invoiceNumber,
      issueDate,
      dueDate,
      status,
      amount,
      companyId: req.user.companyId,
      createdBy: req.user.id
    });
    res.json(newInvoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get invoices for company
router.get('/:companyId', auth, checkSub, async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: { companyId: req.params.companyId }
    });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
