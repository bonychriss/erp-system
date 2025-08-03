const { Finance } = require('../models');

exports.createFinance = async (req, res) => {
  try {
    const { type, amount, description, date, companyId } = req.body;

    // req.user is set by auth middleware
    const finance = await Finance.create({
      type,
      amount,
      description,
      date: date || new Date(),
      companyId,
      createdBy: req.user.id,
    });

    res.status(201).json(finance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFinancesByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const finances = await Finance.findAll({
      where: { companyId },
      order: [['createdAt', 'DESC']],
    });
    res.json(finances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFinanceById = async (req, res) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) return res.status(404).json({ message: 'Finance not found' });
    res.json(finance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateFinance = async (req, res) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) return res.status(404).json({ message: 'Finance not found' });

    await finance.update(req.body);
    res.json(finance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteFinance = async (req, res) => {
  try {
    const finance = await Finance.findByPk(req.params.id);
    if (!finance) return res.status(404).json({ message: 'Finance not found' });

    await finance.destroy();
    res.json({ message: 'Finance deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getFinanceSummary = async (req, res) => {
  try {
    const { companyId } = req.params;

    const [incomeTotal, expenseTotal] = await Promise.all([
      Finance.sum('amount', { where: { companyId, type: 'income' } }),
      Finance.sum('amount', { where: { companyId, type: 'expense' } })
    ]);

    res.json({
      income: incomeTotal || 0,
      expense: expenseTotal || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
