const express = require('express');
const router = express.Router();
const { Subscription } = require('../models');

// POST /api/subscriptions/subscribe
router.post('/subscribe', async (req, res) => {
  const { companyId, plan, endDate } = req.body;

  if (!companyId || !plan || !endDate) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if there is already an active subscription for this company
    const existing = await Subscription.findOne({
      where: {
        companyId,
        status: 'active',
      },
    });

    if (existing) {
      return res.status(400).json({ message: 'Company already has an active subscription' });
    }

    // Create subscription entry with status 'pending' (payment not confirmed yet)
    const subscription = await Subscription.create({
      companyId,
      plan,
      endDate,
      status: 'pending',
    });

    return res.status(201).json({ message: 'Subscription created, awaiting payment confirmation', subscription });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ message: 'Server error during subscription' });
  }
});

module.exports = router;
