// models/index.js

const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with proper configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'erp_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

// Initialize all models
const models = {
  User: require('./User')(sequelize, DataTypes),
  Company: require('./Company')(sequelize, DataTypes),
  Employee: require('./Employee')(sequelize, DataTypes),
  Subscription: require('./Subscription')(sequelize, DataTypes),
  Procurement: require('./Procurement')(sequelize, DataTypes),
  // Add more models here as needed
};

// Run associations for each model if defined
Object.values(models).forEach((model) => {
  if (model?.associate) {
    model.associate(models);
  }
});

// Test DB connection & sync models
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (adjust options if needed)
    await sequelize.sync({ alter: true });
    console.log('✅ All models synchronized');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
})();

// Export Sequelize instance and models
module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
