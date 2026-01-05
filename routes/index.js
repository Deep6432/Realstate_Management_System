const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authController = require('../controllers/authController');
const { requireAuth, requireGuest } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', propertyController.homepage);
router.get('/properties', propertyController.propertyList);
router.get('/property/:id', propertyController.propertyDetail);
router.get('/api/search', propertyController.apiSearch);

// Auth routes
router.get('/login', requireGuest, authController.loginForm);
router.post('/login', requireGuest, authController.login);
router.get('/logout', authController.logout);

// Admin routes (protected)
router.get('/admin/dashboard', requireAuth, propertyController.adminDashboard);
router.get('/admin/property/add', requireAuth, propertyController.addPropertyForm);
router.post('/admin/property/add', requireAuth, upload.array('images', 10), propertyController.addProperty);
router.get('/admin/property/:id/edit', requireAuth, propertyController.editPropertyForm);
router.post('/admin/property/:id/edit', requireAuth, upload.array('images', 10), propertyController.editProperty);
router.get('/admin/property/:id/delete', requireAuth, propertyController.deletePropertyForm);
router.post('/admin/property/:id/delete', requireAuth, propertyController.deleteProperty);

module.exports = router;

