module.exports = (sequelize, DataTypes) => {
  const AccountingTransaction = sequelize.define('AccountingTransaction', {
    type: {
      type: DataTypes.ENUM('Expense', 'Income', 'Asset', 'Liability'),
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    reference: DataTypes.STRING,
    debit: DataTypes.DECIMAL(10, 2),
    credit: DataTypes.DECIMAL(10, 2),
    account: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return AccountingTransaction;
};
