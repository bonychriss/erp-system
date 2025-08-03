// models/Company.js
module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define('Company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // other fields
  }, {
    tableName: 'companies',
    timestamps: true,
  });

  Company.associate = (models) => {
    Company.hasMany(models.Subscription, {
      foreignKey: 'companyId',
      onDelete: 'CASCADE',
    });
    // Add other associations here if needed
  };

  return Company;
};
