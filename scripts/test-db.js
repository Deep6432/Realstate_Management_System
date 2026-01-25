#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run this on your Hostinger server to test database connectivity
 * 
 * Usage: node scripts/test-db.js
 */

require('dotenv').config();
const { testConnection, sequelize } = require('../config/database');

async function testDatabase() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           Database Connection Test                         ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // Display configuration (without passwords)
  console.log('📋 Configuration:');
  console.log(`   DB_ENGINE: ${process.env.DB_ENGINE || 'sqlite'}`);
  
  if (process.env.DB_ENGINE === 'mysql') {
    console.log(`   DB_HOST: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   DB_PORT: ${process.env.DB_PORT || 3306}`);
    console.log(`   DB_NAME: ${process.env.DB_NAME || '❌ NOT SET'}`);
    console.log(`   DB_USER: ${process.env.DB_USER || '❌ NOT SET'}`);
    console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : '❌ NOT SET'}`);
  }
  console.log('');

  // Test connection
  console.log('🔌 Testing connection...');
  const connected = await testConnection();

  if (connected) {
    console.log('\n✅ SUCCESS: Database connection is working!\n');
    
    // Try a simple query
    try {
      await sequelize.query('SELECT 1 as test');
      console.log('✅ Database query test passed.\n');
    } catch (queryError) {
      console.error('⚠️  Connection works but query failed:', queryError.message);
    }
    
    process.exit(0);
  } else {
    console.error('\n❌ FAILED: Database connection failed!\n');
    console.error('📝 Troubleshooting steps:');
    console.error('   1. Verify database credentials in .env file');
    console.error('   2. Check if database exists in Hostinger hPanel');
    console.error('   3. Verify DB_HOST is correct (usually "localhost")');
    console.error('   4. Check database user permissions');
    console.error('   5. Ensure MySQL service is running\n');
    
    // Try to get more details
    try {
      await sequelize.authenticate();
    } catch (error) {
      console.error('📋 Error Details:');
      console.error(`   Message: ${error.message}`);
      if (error.original) {
        console.error(`   Code: ${error.original.code || 'N/A'}`);
        console.error(`   SQL State: ${error.original.sqlState || 'N/A'}`);
      }
      console.error('');
    }
    
    process.exit(1);
  }
}

testDatabase().catch((error) => {
  console.error('\n❌ Unexpected error:', error);
  process.exit(1);
});
