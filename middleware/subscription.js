// middleware/subscription.js
module.exports = (req, res, next) => {
  // Check if user has active subscription
  if (!req.user?.subscriptionActive) {
    return res.status(403).json({ 
      message: 'Active subscription required',
      code: 'SUBSCRIPTION_REQUIRED'
    });
  }
  next();
};