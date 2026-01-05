const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PropertyImage = sequelize.define('PropertyImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  uploaded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'property_images',
  timestamps: false
});

// Define associations (will be set up in a separate file to avoid circular dependency)

module.exports = PropertyImage;

