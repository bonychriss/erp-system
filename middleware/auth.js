const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Async handler wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    // Development fallback (remove in production)
    if (process.env.NODE_ENV === 'development' && (!authHeader || !authHeader.startsWith('Bearer '))) {
      const devUser = await User.findByPk(1);
      if (!devUser) throw new Error('Development user not found');
      
      req.user = {
        id: devUser.id,
        companyId: devUser.companyId,
        role: devUser.role
      };
      return next();
    }

    // Production validation
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      companyId: user.companyId,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Authentication failed' });
  }
});