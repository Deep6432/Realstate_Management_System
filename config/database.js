const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for local development if DB_ENGINE is not set to 'mysql'
const DB_ENGINE = process.env.DB_ENGINE || 'sqlite';

let sequelize;

if (DB_ENGINE === 'mysql') {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true
      }
    }
  );
} else {
  // SQLite for local development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  });
}

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

module.exports = { sequelize, testConnection };

