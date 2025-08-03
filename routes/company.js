const express = require('express');
const router = express.Router();
const { Company } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Only admin can create company
router.post('/', authMiddleware, roleMiddleware('admin'), async (req, res) => {
  try {
    const { name, industry, address, createdBy } = req.body;

    const newCompany = await Company.create({
      name,
      industry,
      address,
      createdBy
    });

    res.status(201).json({ message: 'Company created', company: newCompany });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all companies - accessible by any authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    console.error('Get Companies Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get company by ID - accessible by any authenticated user
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const companyId = req.params.id;

    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (err) {
    console.error('Get Company by ID Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
