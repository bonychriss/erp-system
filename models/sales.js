module.exports = (sequelize, DataTypes) => {
  const Sales = sequelize.define('Sales', {
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }
  });

  Sales.associate = (models) => {
    Sales.belongsTo(models.User, { foreignKey: 'userId' });
    Sales.belongsTo(models.Company, { foreignKey: 'companyId' });
  };

  return Sales;
};