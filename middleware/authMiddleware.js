const jwt = require('jsonwebtoken');
const { User } = require('../models');

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided - allow default user in development mode ONLY
      if (process.env.NODE_ENV === 'development') {
        const user = await User.findByPk(1);
        if (!user) {
          return res.status(401).json({ message: 'Default user not found' });
        }
        req.user = {
          id: user.id,
          companyId: user.companyId,
          role: user.role,
        };
        return next();
      }
      return res.status(401).json({ message: 'No token provided' });
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
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
