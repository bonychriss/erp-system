const express = require('express');
const router = express.Router();
const { Employee } = require('../models');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/employees
router.post('/', async (req, res) => {
  try {
    // Authorization check
    if (!['admin', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Only admins/managers can add employees' 
      });
    }

    const { name, email, position, department } = req.body;

    // Validation
    if (!name || !email || !position || !department) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newEmployee = await Employee.create({
      name,
      email,
      position,
      department,
      companyId: req.user.companyId,
      addedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: newEmployee
    });

  } catch (error) {
    console.error('Create Employee Error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    
    res.status(500).json({ 
      message: 'Employee creation failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll({ 
      where: { companyId: req.user.companyId },
      attributes: ['id', 'name', 'email', 'position', 'department']
    });

    res.json({
      success: true,
      count: employees.length,
      data: employees
    });

  } catch (error) {
    console.error('Get Employees Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch employees',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;