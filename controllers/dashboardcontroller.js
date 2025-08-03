// controllers/dashboardController.js

const User = require('../models/user');
const Company = require('../models/company');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate('company');
    if (!user || !user.company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const company = user.company;

    res.json({
      user: {
        name: user.name,
        role: user.role,
        department: user.department
      },
      companyName: company.name,
      owner: company.owner,
      modules: [
        'Sales & Marketing',
        'Finance',
        'Procurement',
        'Inventory',
        'HR',
        'Logistics',
        'Customer Service',
        'IT',
        'Operations'
      ]
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ message: 'Dashboard failed' });
  }
};
