const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PROPERTY_TYPE_CHOICES = [
  ['Home', 'Home'],
  ['Flat / Apartment', 'Flat / Apartment'],
  ['Land', 'Land'],
  ['Commercial Land', 'Commercial Land'],
  ['Plot', 'Plot'],
  ['Farm Land', 'Farm Land'],
  ['Warehouse', 'Warehouse'],
  ['Shop', 'Shop'],
];

const SIZE_UNIT_CHOICES = [
  ['sq ft', 'sq ft'],
  ['sq yard', 'sq yard'],
  ['acre', 'acre'],
];

const STATUS_CHOICES = [
  ['Available', 'Available'],
  ['Sold', 'Sold'],
  ['On Hold', 'On Hold'],
];

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  property_type: {
    type: DataTypes.ENUM(...PROPERTY_TYPE_CHOICES.map(c => c[0])),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  khasra_number: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  full_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  size: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  size_unit: {
    type: DataTypes.ENUM(...SIZE_UNIT_CHOICES.map(c => c[0])),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(...STATUS_CHOICES.map(c => c[0])),
    defaultValue: 'Available',
    allowNull: false
  }
}, {
  tableName: 'properties',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['city'] },
    { fields: ['property_type'] },
    { fields: ['status'] },
    { fields: ['khasra_number'] }
  ]
});

// Instance methods
Property.prototype.getImages = async function() {
  return await PropertyImage.findAll({
    where: { property_id: this.id },
    order: [['uploaded_at', 'ASC']]
  });
};

Property.prototype.getPrimaryImage = async function() {
  const image = await PropertyImage.findOne({
    where: { property_id: this.id },
    order: [['uploaded_at', 'ASC']]
  });
  return image;
};

module.exports = {
  Property,
  PROPERTY_TYPE_CHOICES,
  SIZE_UNIT_CHOICES,
  STATUS_CHOICES
};

