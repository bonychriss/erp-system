module.exports = (sequelize, DataTypes) => {
  const Finance = sequelize.define('Finance', {
    type: {
      type: DataTypes.ENUM('income', 'expense'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'finances',
    timestamps: true,
  });

  Finance.associate = (models) => {
    Finance.belongsTo(models.User, { foreignKey: 'createdBy' });
    Finance.belongsTo(models.Company, { foreignKey: 'companyId' });
  };

  return Finance;
};
