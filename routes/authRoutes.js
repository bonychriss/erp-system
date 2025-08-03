const express = require('express');
const router = express.Router();
const { createCompany } = require('../controllers/companyController');
const authenticateUser = require('../middleware/authMiddleware');

// POST /api/company/create
router.post('/create', authenticateUser, createCompany);

module.exports = router;
