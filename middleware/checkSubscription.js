const db = require('../models');

const checkSubscription = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const subscription = await db.Subscription.findOne({ where: { companyId } });

    if (!subscription || !subscription.active) {
      return res.status(403).json({ message: 'Subscription required to access this feature.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during subscription check.' });
  }
};

module.exports = checkSubscription;
