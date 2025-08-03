const express = require('express');
const router = express.Router();
const { Subscription } = require('../models');

// POST /api/subscriptions/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { companyId, planName, startDate, endDate } = req.body;

    if (!companyId || !planName || !startDate || !endDate) {
      return res.status(400).json({ message: 'companyId, planName, startDate, and endDate are required' });
    }

    const existing = await Subscription.findOne({ where: { companyId } });

    if (existing) {
      existing.planName = planName;
      existing.startDate = startDate;
      existing.endDate = endDate;
      existing.status = 'active';
      await existing.save();
      return res.json({ message: 'Subscription updated successfully' });
    }

    await Subscription.create({
      companyId,
      planName,
      startDate,
      endDate,
      status: 'active',
    });

    res.status(201).json({ message: 'Subscription created successfully' });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ message: 'Failed to subscribe', error: error.message });
  }
});

// GET /api/subscriptions/subscription-status/:companyId
router.get('/subscription-status/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;

    const subscription = await Subscription.findOne({
      where: { companyId },
      order: [['createdAt', 'DESC']],
    });

    if (!subscription) {
      return res.status(404).json({ status: 'not_subscribed' });
    }

    const now = new Date();
    const isActive = subscription.status === 'active' && new Date(subscription.endDate) >= now;

    res.json({
      companyId,
      planName: subscription.planName,
      status: isActive ? 'active' : 'expired',
      expires: subscription.endDate,
    });
  } catch (err) {
    console.error('Subscription status error:', err);
    res.status(500).json({ message: 'Error checking subscription' });
  }
});

module.exports = router;
