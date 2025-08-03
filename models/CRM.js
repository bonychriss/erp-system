// models/CRM.js
module.exports = (sequelize, DataTypes) => {
  const CRM = sequelize.define('CRM', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('lead', 'contacted', 'qualified', 'won', 'lost'),
      defaultValue: 'lead',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  CRM.associate = (models) => {
    // e.g. CRM.belongsTo(models.Company, { foreignKey: 'companyId' });
  };

  return CRM;
};
