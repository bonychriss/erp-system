const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const authMiddleware = require('../middleware/authMiddleware');
const checkSubscription = require('../middleware/checkSubscription');

router.use(authMiddleware);

// Finance Routes
router.post('/', financeController.createFinance);
router.get('/company/:companyId', financeController.getFinancesByCompany);
router.get('/summary/:companyId', financeController.getFinanceSummary);
router.get('/:id', financeController.getFinanceById);
router.put('/:id', financeController.updateFinance);
router.delete('/:id', financeController.deleteFinance);

router.post('/create', checkSubscription, async (req, res) => {
  res.json({ message: "Subscription check passed." });
});

module.exports = router;
