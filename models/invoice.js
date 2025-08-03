module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Overdue'),
      defaultValue: 'Pending',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Invoice.associate = (models) => {
    Invoice.belongsTo(models.Company, { foreignKey: 'companyId' });
    Invoice.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Invoice;
};
