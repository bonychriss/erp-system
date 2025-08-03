const Company = require('../models/Company');

// Create new company
exports.createCompany = async (req, res) => {
  try {
    const { name, type, location } = req.body;
    const company = new Company({
      name,
      type,
      location,
      createdBy: req.user.id
    });
    await company.save();
    res.status(201).json({ message: 'Company created successfully', company });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get companies created by logged-in user
exports.getMyCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ createdBy: req.user.id });
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
