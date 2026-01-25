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

// Static files configuration - HOSTINGER-SPECIFIC FIX
// IMPORTANT: Use absolute path and /public prefix (required for Hostinger)
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

// CRITICAL: Use /public prefix (Hostinger requirement)
app.use('/public', express.static(publicPath, staticOptions));

// Fallback paths for compatibility
app.use('/static', express.static(publicPath, staticOptions));
app.use(express.static(publicPath, staticOptions)); // Root level fallback

// Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Explicit routes for critical static files (Hostinger fallback)
app.get('/public/css/style.css', (req, res) => {
  res.sendFile(path.join(publicPath, 'css', 'style.css'), {
    headers: {
      'Content-Type': 'text/css; charset=utf-8'
    }
  });
});

app.get('/public/js/main.js', (req, res) => {
  res.sendFile(path.join(publicPath, 'js', 'main.js'), {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  });
});

app.get('/public/favicon.svg', (req, res) => {
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

// Error handler - Enhanced logging for production debugging
app.use((err, req, res, next) => {
  // Enhanced error logging
  console.error('\n❌ ============================================');
  console.error('❌ INTERNAL SERVER ERROR');
  console.error('❌ ============================================');
  console.error(`\n📋 Request Details:`);
  console.error(`   Method: ${req.method}`);
  console.error(`   URL: ${req.originalUrl}`);
  console.error(`   Path: ${req.path}`);
  console.error(`   IP: ${req.ip}`);
  console.error(`\n📋 Error Details:`);
  console.error(`   Message: ${err.message}`);
  console.error(`   Stack: ${err.stack}`);
  if (err.original) {
    console.error(`   Original Error: ${err.original.message}`);
    console.error(`   SQL State: ${err.original.sqlState || 'N/A'}`);
    console.error(`   SQL Code: ${err.original.code || 'N/A'}`);
  }
  console.error('❌ ============================================\n');
  
  // Send response
  res.status(500).render('error', {
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? {
      message: err.message,
      stack: err.stack
    } : null,
    user: req.session.user || null
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('\n🔍 Starting Real Estate Management System...\n');
    
    // Log environment info (without sensitive data)
    console.log('📋 Environment Configuration:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   PORT: ${PORT}`);
    console.log(`   DB_ENGINE: ${process.env.DB_ENGINE || 'sqlite'}`);
    if (process.env.DB_ENGINE === 'mysql') {
      console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
      console.log(`   DB_NAME: ${process.env.DB_NAME ? '***' : '❌ NOT SET'}`);
      console.log(`   DB_USER: ${process.env.DB_USER ? '***' : '❌ NOT SET'}`);
      console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : '❌ NOT SET'}`);
    }
    console.log('');

    // Test database connection with retry logic
    console.log('🔌 Testing database connection...');
    let dbConnected = false;
    let retries = 3;
    let retryDelay = 2000; // 2 seconds

    while (retries > 0 && !dbConnected) {
      dbConnected = await testConnection();
      if (!dbConnected) {
        retries--;
        if (retries > 0) {
          console.log(`⚠️  Database connection failed. Retrying in ${retryDelay/1000}s... (${retries} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!dbConnected) {
      console.error('\n❌ ============================================');
      console.error('❌ DATABASE CONNECTION FAILED');
      console.error('❌ ============================================');
      console.error('\n📝 Common causes:');
      console.error('   1. Database credentials incorrect in .env file');
      console.error('   2. Database does not exist');
      console.error('   3. Database server is not running');
      console.error('   4. Wrong DB_HOST or DB_PORT');
      console.error('\n🔧 Fix steps:');
      console.error('   1. Check your .env file on the server');
      console.error('   2. Verify database exists in Hostinger hPanel');
      console.error('   3. Test connection: node scripts/test-db.js');
      console.error('   4. Check Hostinger error logs');
      console.error('\n');
      
      // Log detailed error for debugging
      try {
        await sequelize.authenticate();
      } catch (dbError) {
        console.error('📋 Database Error Details:');
        console.error(`   Message: ${dbError.message}`);
        if (dbError.original) {
          console.error(`   Original: ${dbError.original.message || dbError.original.code}`);
        }
        console.error('');
      }
      
      process.exit(1);
    }

    console.log('✅ Database connection established.\n');

    // Sync database (create tables if they don't exist)
    console.log('📊 Synchronizing database tables...');
    try {
      const { Property, PropertyImage } = require('./models/Property');
      const User = require('./models/User');
      
      // Sync with error handling
      await sequelize.sync({ alter: false }); // Set to { force: true } to drop and recreate tables
      console.log('✅ Database tables synchronized.\n');
      
      // Verify tables exist
      try {
        const [tables] = await sequelize.query("SHOW TABLES");
        const tableNames = tables.map(row => Object.values(row)[0]);
        console.log(`📋 Found ${tableNames.length} table(s) in database:`);
        tableNames.forEach(table => console.log(`   - ${table}`));
        console.log('');
      } catch (verifyError) {
        console.warn('⚠️  Could not verify tables (non-critical):', verifyError.message);
      }
    } catch (syncError) {
      console.error('\n❌ ============================================');
      console.error('❌ DATABASE SYNC FAILED');
      console.error('❌ ============================================');
      console.error(`\nError: ${syncError.message}`);
      if (syncError.original) {
        console.error(`Original Error: ${syncError.original.message}`);
        console.error(`SQL State: ${syncError.original.sqlState || 'N/A'}`);
        console.error(`SQL Code: ${syncError.original.code || 'N/A'}`);
      }
      console.error('\n📝 Common causes:');
      console.error('   1. Database user lacks CREATE TABLE permissions');
      console.error('   2. Table names conflict with existing tables');
      console.error('   3. Model definitions have syntax errors');
      console.error('   4. Database connection issues');
      console.error('\n🔧 Solutions:');
      console.error('   1. Check database user permissions in Hostinger');
      console.error('   2. Verify models are correctly defined');
      console.error('   3. Check server logs for detailed errors');
      console.error('   4. Run: node scripts/check-tables.js\n');
      throw syncError;
    }

    // Create default admin user if it doesn't exist
    try {
      const User = require('./models/User');
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
      } else {
        console.log(`✅ Admin user already exists: ${adminUsername}`);
      }
      console.log('');
    } catch (userError) {
      console.error('⚠️  Warning: Could not create admin user:', userError.message);
      console.error('   You may need to create an admin user manually.\n');
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
      console.log(`   Username: ${process.env.ADMIN_USERNAME || 'Ajay'}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Ajay@2026'}`);
      console.log(`\n`);
    }).on('error', (err) => {
      console.error('\n❌ ============================================');
      console.error('❌ SERVER FAILED TO START');
      console.error('❌ ============================================');
      console.error(`\nError: ${err.message}`);
      if (err.code === 'EADDRINUSE') {
        console.error(`\n⚠️  Port ${PORT} is already in use.`);
        console.error('   Solutions:');
        console.error('   1. Change PORT in .env file');
        console.error('   2. Stop the process using this port');
        console.error('   3. Let Hostinger assign port automatically');
      }
      console.error('');
      process.exit(1);
    });
  } catch (error) {
    console.error('\n❌ ============================================');
    console.error('❌ FAILED TO START SERVER');
    console.error('❌ ============================================');
    console.error(`\nError: ${error.message}`);
    console.error(`\nStack trace:`);
    console.error(error.stack);
    console.error('\n📝 Check the error above and fix the issue.');
    console.error('   Common issues:');
    console.error('   - Database connection failed');
    console.error('   - Missing environment variables');
    console.error('   - Missing dependencies (run: npm install)');
    console.error('   - File permissions incorrect');
    console.error('');
    process.exit(1);
  }
};

startServer();

module.exports = app;

