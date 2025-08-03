const express = require('express');
const router = express.Router();
const { AccountingTransaction } = require('../models');
const authenticate = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');

// ➕ Create accounting transaction
router.post('/:companyId', authenticate, checkSubscription, async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const { type, date, reference, debit, credit, account, description } = req.body;

    const newTransaction = await AccountingTransaction.create({
      type,
      date,
      reference,
      debit,
      credit,
      account,
      description,
      companyId,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
    res.status(500).json({ message: 'Server error while creating transaction' });
  }
});

// 📄 Get all transactions for a company
router.get('/:companyId', authenticate, checkSubscription, async (req, res) => {
  try {
    const companyId = req.params.companyId;

    const transactions = await AccountingTransaction.findAll({
      where: { companyId },
      order: [['date', 'DESC']],
    });

    res.json(transactions);
  } catch (error) {
    console.error('❌ Error fetching transactions:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router; // ✅ Make sure it's exported like this
