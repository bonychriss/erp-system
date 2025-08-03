module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    productName: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    category: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
  });
  return Inventory;
};
