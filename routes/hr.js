const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const authMiddleware = require('../middleware/authMiddleware');


// Add employee
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { fullName, email, position, department } = req.body;
    const companyId = req.user.companyId;

    const newEmployee = await Employee.create({
      fullName,
      email,
      position,
      department,
      companyId,
      addedBy: req.user.id,
    });

    res.status(201).json({ message: 'Employee added', employee: newEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all employees for a company
router.get('/', authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: { companyId: req.user.companyId },
    });
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee (EDIT)
router.put('/edit/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.params.id, companyId: req.user.companyId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const { name, email, position, department } = req.body;

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.position = position || employee.position;
    employee.department = department || employee.department;

    await employee.save();

    res.json({ message: 'Employee updated', employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.params.id, companyId: req.user.companyId },
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();

    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
