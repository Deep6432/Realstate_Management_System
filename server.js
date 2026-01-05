const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static files
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Flash messages
app.use(flash());

// Make flash messages available to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    message: 'Page not found',
    user: req.session.user || null
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', {
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : null,
    user: req.session.user || null
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Database connection failed. Please check your database configuration.');
      process.exit(1);
    }

    // Sync database (create tables if they don't exist)
    const { Property, PropertyImage } = require('./models/Property');
    const User = require('./models/User');
    
    await sequelize.sync({ alter: false }); // Set to { force: true } to drop and recreate tables
    console.log('✅ Database tables synchronized.');

    // Create default admin user if it doesn't exist
    const adminUsername = process.env.ADMIN_USERNAME || 'Ajay';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Ajay@2026';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';

    const existingAdmin = await User.findOne({ where: { username: adminUsername } });
    if (!existingAdmin) {
      const admin = await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        is_admin: true
      });
      console.log(`✅ Default admin user created: ${adminUsername}`);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
      console.log(`║     Real Estate Management System - Node.js                  ║`);
      console.log(`╚══════════════════════════════════════════════════════════════╝`);
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`\n📖 Available routes:`);
      console.log(`   - Homepage: http://localhost:${PORT}/`);
      console.log(`   - Properties: http://localhost:${PORT}/properties`);
      console.log(`   - Admin Login: http://localhost:${PORT}/login`);
      console.log(`   - Admin Dashboard: http://localhost:${PORT}/admin/dashboard`);
      console.log(`\n👤 Default Admin Credentials:`);
      console.log(`   Username: ${adminUsername}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

