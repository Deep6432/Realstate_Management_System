const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const routes = require('./routes/index');

const app = express();
// Use PORT from environment or default to 3000
// Hostinger may set PORT automatically
const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static files configuration - Multiple paths for Hostinger compatibility
const publicPath = path.join(__dirname, 'public');
const staticOptions = {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    }
  }
};

// Serve static files from multiple paths for Hostinger compatibility
app.use(express.static(publicPath, staticOptions)); // Root level
app.use('/static', express.static(publicPath, staticOptions)); // /static path
app.use('/css', express.static(path.join(publicPath, 'css'), staticOptions)); // Direct /css path
app.use('/js', express.static(path.join(publicPath, 'js'), staticOptions)); // Direct /js path
app.use('/images', express.static(path.join(publicPath, 'images'), staticOptions)); // Direct /images path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Explicit routes for critical static files (fallback)
app.get('/static/css/style.css', (req, res) => {
  res.sendFile(path.join(publicPath, 'css', 'style.css'), {
    headers: {
      'Content-Type': 'text/css; charset=utf-8'
    }
  });
});

app.get('/static/js/main.js', (req, res) => {
  res.sendFile(path.join(publicPath, 'js', 'main.js'), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  });
});

app.get('/static/favicon.svg', (req, res) => {
  res.sendFile(path.join(publicPath, 'favicon.svg'), {
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  });
});

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

    // Start server - listen on 0.0.0.0 for Hostinger
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n╔══════════════════════════════════════════════════════════════╗`);
      console.log(`║     Real Estate Management System - Node.js                  ║`);
      console.log(`╚══════════════════════════════════════════════════════════════╝`);
      console.log(`\n✅ Server running on http://0.0.0.0:${PORT}`);
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
    }).on('error', (err) => {
      console.error('❌ Server failed to start:', err);
      if (err.code === 'EADDRINUSE') {
        console.error(`⚠️  Port ${PORT} is already in use. Try a different port.`);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

