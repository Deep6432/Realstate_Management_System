const { Property, PropertyImage, PROPERTY_TYPE_CHOICES, STATUS_CHOICES, SIZE_UNIT_CHOICES } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Homepage
exports.homepage = async (req, res) => {
  try {
    res.render('properties/homepage', {
      property_types: PROPERTY_TYPE_CHOICES,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Homepage error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// Property List with search and filters
exports.propertyList = async (req, res) => {
  try {
    const { city, search, property_type, status, size_min, size_max, page = 1 } = req.query;
    const limit = 12;
    const offset = (parseInt(page) - 1) * limit;

    let where = {};

    // City search
    if (city && city.trim()) {
      where.city = { [Op.like]: `%${city.trim()}%` };
    }

    // Global search
    if (search && search.trim()) {
      where[Op.or] = [
        { city: { [Op.like]: `%${search.trim()}%` } },
        { khasra_number: { [Op.like]: `%${search.trim()}%` } },
        { full_address: { [Op.like]: `%${search.trim()}%` } },
        { property_type: { [Op.like]: `%${search.trim()}%` } },
        { description: { [Op.like]: `%${search.trim()}%` } }
      ];
    }

    // Filters
    if (property_type) {
      where.property_type = property_type;
    }

    if (status) {
      where.status = status;
    }

    if (size_min) {
      where.size = { ...where.size, [Op.gte]: parseFloat(size_min) };
    }

    if (size_max) {
      where.size = { ...where.size, [Op.lte]: parseFloat(size_max) };
    }

    const { count, rows: properties } = await Property.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{
        model: PropertyImage,
        as: 'images',
        limit: 1,
        required: false
      }]
    });

    const totalPages = Math.ceil(count / limit);

    res.render('properties/property_list', {
      properties,
      property_types: PROPERTY_TYPE_CHOICES,
      status_choices: STATUS_CHOICES,
      current_city: city || '',
      current_search: search || '',
      current_type: property_type || '',
      current_status: status || '',
      size_min: size_min || '',
      size_max: size_max || '',
      currentPage: parseInt(page),
      totalPages,
      totalProperties: count,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Property list error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// Property Detail
exports.propertyDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id, {
      include: [{
        model: PropertyImage,
        as: 'images',
        order: [['uploaded_at', 'ASC']]
      }]
    });

    if (!property) {
      return res.status(404).render('error', { message: 'Property not found' });
    }

    res.render('properties/property_detail', {
      property,
      images: property.images || [],
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Property detail error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// API Search
exports.apiSearch = async (req, res) => {
  try {
    const query = req.query.q?.trim();
    
    if (!query) {
      return res.json({ properties: [] });
    }

    const properties = await Property.findAll({
      where: {
        [Op.or]: [
          { city: { [Op.like]: `%${query}%` } },
          { khasra_number: { [Op.like]: `%${query}%` } },
          { full_address: { [Op.like]: `%${query}%` } },
          { property_type: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      limit: 10,
      include: [{
        model: PropertyImage,
        as: 'images',
        limit: 1
      }]
    });

    const results = properties.map(prop => {
      const primaryImage = prop.images && prop.images.length > 0 ? prop.images[0] : null;
      return {
        id: prop.id,
        property_type: prop.property_type,
        city: prop.city,
        khasra_number: prop.khasra_number,
        size: prop.size.toString(),
        size_unit: prop.size_unit,
        status: prop.status,
        image_url: primaryImage ? `/uploads/property_images/${primaryImage.image}` : null,
        url: `/property/${prop.id}`
      };
    });

    res.json({ properties: results });
  } catch (error) {
    console.error('API search error:', error);
    res.json({ properties: [] });
  }
};

// Admin Dashboard
exports.adminDashboard = async (req, res) => {
  try {
    const { search } = req.query;
    
    const totalProperties = await Property.count();
    const availableProperties = await Property.count({ where: { status: 'Available' } });
    const soldProperties = await Property.count({ where: { status: 'Sold' } });
    const onHoldProperties = await Property.count({ where: { status: 'On Hold' } });

    // Properties by type
    const propertiesByType = {};
    for (const [type] of PROPERTY_TYPE_CHOICES) {
      propertiesByType[type] = await Property.count({ where: { property_type: type } });
    }

    // Properties list
    let where = {};
    let isSearch = false;
    let sectionTitle = 'Recent Properties';

    if (search && search.trim()) {
      where = {
        [Op.or]: [
          { city: { [Op.like]: `%${search.trim()}%` } },
          { khasra_number: { [Op.like]: `%${search.trim()}%` } },
          { full_address: { [Op.like]: `%${search.trim()}%` } },
          { property_type: { [Op.like]: `%${search.trim()}%` } },
          { description: { [Op.like]: `%${search.trim()}%` } }
        ]
      };
      isSearch = true;
      const searchCount = await Property.count({ where });
      sectionTitle = `Search Results (${searchCount})`;
    }

    const properties = await Property.findAll({
      where,
      limit: isSearch ? undefined : 10,
      order: [['created_at', 'DESC']],
      include: [{
        model: PropertyImage,
        as: 'images',
        limit: 1,
        required: false
      }]
    });

    res.render('properties/admin_dashboard', {
      total_properties: totalProperties,
      available_properties: availableProperties,
      sold_properties: soldProperties,
      on_hold_properties: onHoldProperties,
      properties_by_type: propertiesByType,
      properties,
      is_search: isSearch,
      section_title: sectionTitle,
      search_query: search || '',
      property_types: PROPERTY_TYPE_CHOICES,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// Add Property (GET)
exports.addPropertyForm = async (req, res) => {
  try {
    res.render('properties/property_form', {
      property: null,
      existing_images: [],
      title: 'Add New Property',
      action: 'Add',
      property_types: PROPERTY_TYPE_CHOICES,
      status_choices: STATUS_CHOICES,
      size_unit_choices: SIZE_UNIT_CHOICES,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Add property form error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// Add Property (POST)
exports.addProperty = async (req, res) => {
  try {
    const propertyData = {
      property_type: req.body.property_type,
      city: req.body.city,
      khasra_number: req.body.khasra_number,
      full_address: req.body.full_address,
      size: parseFloat(req.body.size),
      size_unit: req.body.size_unit,
      description: req.body.description || null,
      status: req.body.status || 'Available'
    };

    const property = await Property.create(propertyData);

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => {
        return PropertyImage.create({
          property_id: property.id,
          image: file.filename
        });
      });
      await Promise.all(imagePromises);
    }

    req.flash('success', `Property "${property.property_type} - ${property.city}" has been added successfully!`);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Add property error:', error);
    req.flash('error', 'Error adding property. Please try again.');
    res.redirect('/admin/property/add');
  }
};

// Edit Property (GET)
exports.editPropertyForm = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id, {
      include: [{
        model: PropertyImage,
        as: 'images'
      }]
    });

    if (!property) {
      req.flash('error', 'Property not found.');
      return res.redirect('/admin/dashboard');
    }

    res.render('properties/property_form', {
      property,
      existing_images: property.images || [],
      title: 'Edit Property',
      action: 'Update',
      property_types: PROPERTY_TYPE_CHOICES,
      status_choices: STATUS_CHOICES,
      size_unit_choices: SIZE_UNIT_CHOICES,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Edit property form error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// Edit Property (POST)
exports.editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id);

    if (!property) {
      req.flash('error', 'Property not found.');
      return res.redirect('/admin/dashboard');
    }

    // Update property data
    property.property_type = req.body.property_type;
    property.city = req.body.city;
    property.khasra_number = req.body.khasra_number;
    property.full_address = req.body.full_address;
    property.size = parseFloat(req.body.size);
    property.size_unit = req.body.size_unit;
    property.description = req.body.description || null;
    property.status = req.body.status || 'Available';
    await property.save();

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => {
        return PropertyImage.create({
          property_id: property.id,
          image: file.filename
        });
      });
      await Promise.all(imagePromises);
    }

    // Handle image deletion
    if (req.body.delete_images) {
      const deleteIds = Array.isArray(req.body.delete_images) 
        ? req.body.delete_images 
        : [req.body.delete_images];
      
      for (const imageId of deleteIds) {
        const image = await PropertyImage.findByPk(imageId);
        if (image && image.property_id === property.id) {
          // Delete file
          const imagePath = path.join(__dirname, '../uploads/property_images', image.image);
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
          await image.destroy();
        }
      }
    }

    req.flash('success', `Property "${property.property_type} - ${property.city}" has been updated successfully!`);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Edit property error:', error);
    req.flash('error', 'Error updating property. Please try again.');
    res.redirect(`/admin/property/${req.params.id}/edit`);
  }
};

// Delete Property (GET)
exports.deletePropertyForm = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id, {
      include: [{
        model: PropertyImage,
        as: 'images'
      }]
    });

    if (!property) {
      req.flash('error', 'Property not found.');
      return res.redirect('/admin/dashboard');
    }

    res.render('properties/delete_property', {
      property,
      user: req.session.user || null
    });
  } catch (error) {
    console.error('Delete property form error:', error);
    res.status(500).render('error', { message: 'Internal server error' });
  }
};

// Delete Property (POST)
exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findByPk(id, {
      include: [{
        model: PropertyImage,
        as: 'images'
      }]
    });

    if (!property) {
      req.flash('error', 'Property not found.');
      return res.redirect('/admin/dashboard');
    }

    const propertyName = `${property.property_type} - ${property.city}`;

    // Delete associated images
    if (property.images) {
      for (const image of property.images) {
        const imagePath = path.join(__dirname, '../uploads/property_images', image.image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
    }

    await property.destroy();
    req.flash('success', `Property "${propertyName}" has been deleted successfully!`);
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Delete property error:', error);
    req.flash('error', 'Error deleting property. Please try again.');
    res.redirect('/admin/dashboard');
  }
};

