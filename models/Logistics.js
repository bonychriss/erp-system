module.exports = (sequelize, DataTypes) => {
  const Logistics = sequelize.define('Logistics', {
    shipmentName: DataTypes.STRING,
    carrier: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'In Transit',
    },
    destination: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
  });
  return Logistics;
};
