// middleware/roleMiddleware.js
module.exports = function(role) {
  return function(req, res, next) {
    if (req.user && req.user.role === role) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
};