module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define('Employee', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.ENUM(
        'sales',
        'procurement',
        'inventory',
        'logistics',
        'finance',
        'hr',
        'customer-service',
        'it',
        'operations'
      ),
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    addedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
  });

  Employee.associate = (models) => {
    Employee.belongsTo(models.Company, { foreignKey: 'companyId', as: 'company' });
    Employee.belongsTo(models.User, { foreignKey: 'addedBy', as: 'addedByUser' });
  };

  return Employee;
};
