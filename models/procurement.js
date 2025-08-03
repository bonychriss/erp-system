// models/Procurement.js

module.exports = (sequelize, DataTypes) => {
  const Procurement = sequelize.define('Procurement', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
    },
    item: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    requestedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    tableName: 'procurements',
    timestamps: true,
  });

  Procurement.associate = (models) => {
    Procurement.belongsTo(models.Company, {
      foreignKey: 'companyId',
      onDelete: 'CASCADE',
    });
  };

  return Procurement;
};
