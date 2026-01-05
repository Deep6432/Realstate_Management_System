// Model associations
const { Property } = require('./Property');
const PropertyImage = require('./PropertyImage');
const User = require('./User');

// Define associations
Property.hasMany(PropertyImage, { foreignKey: 'property_id', as: 'images' });
PropertyImage.belongsTo(Property, { foreignKey: 'property_id', as: 'property' });

module.exports = {
  Property,
  PropertyImage,
  User,
  PROPERTY_TYPE_CHOICES: require('./Property').PROPERTY_TYPE_CHOICES,
  SIZE_UNIT_CHOICES: require('./Property').SIZE_UNIT_CHOICES,
  STATUS_CHOICES: require('./Property').STATUS_CHOICES
};

