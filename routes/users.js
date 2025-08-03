const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/authmiddleware');

// Protect all routes below with authentication middleware
router.use(authMiddleware);

// PUT /api/users/:id - Admin updates user info (role, companyId, department)
router.put('/:id', async (req, res) => {
  // Only admins can update user info
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { role, companyId, department } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update only provided fields, else keep existing
    user.role = role || user.role;
    user.companyId = companyId || user.companyId;
    user.department = department || user.department;

    await user.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
