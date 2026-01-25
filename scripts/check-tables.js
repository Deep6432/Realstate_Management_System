#!/usr/bin/env node

/**
 * Check Database Tables Script
 * Verifies that all required database tables exist
 * 
 * Usage: node scripts/check-tables.js
 */

require('dotenv').config();
const { sequelize } = require('../config/database');

async function checkTables() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║           Database Tables Check                              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection established.\n');

    // Get list of tables
    const [results] = await sequelize.query("SHOW TABLES");
    const tableNames = results.map(row => Object.values(row)[0]);

    console.log('📋 Existing Tables:');
    if (tableNames.length === 0) {
      console.log('   ⚠️  No tables found in database!\n');
      console.log('🔧 Solution: Run database sync');
      console.log('   In server.js, the app should sync tables on startup.');
      console.log('   Or manually run: node -e "require(\'./config/database\').sequelize.sync()"\n');
      process.exit(1);
    } else {
      tableNames.forEach(table => {
        console.log(`   ✅ ${table}`);
      });
    }

    // Check required tables
    console.log('\n📋 Required Tables:');
    const requiredTables = ['Properties', 'PropertyImages', 'Users'];
    let allTablesExist = true;

    for (const table of requiredTables) {
      if (tableNames.includes(table)) {
        console.log(`   ✅ ${table} exists`);
      } else {
        console.log(`   ❌ ${table} MISSING`);
        allTablesExist = false;
      }
    }

    if (allTablesExist) {
      console.log('\n✅ All required tables exist!\n');
      
      // Check table structure
      console.log('📊 Checking table structures...\n');
      for (const table of requiredTables) {
        try {
          const [columns] = await sequelize.query(`DESCRIBE ${table}`);
          console.log(`✅ ${table} structure OK (${columns.length} columns)`);
        } catch (err) {
          console.error(`❌ Error checking ${table}: ${err.message}`);
        }
      }
      console.log('');
      process.exit(0);
    } else {
      console.log('\n❌ Some required tables are missing!\n');
      console.log('🔧 Solution:');
      console.log('   1. Check if database sync ran on startup');
      console.log('   2. Check server logs for sync errors');
      console.log('   3. Manually sync: node -e "require(\'./config/database\').sequelize.sync({ alter: true })"\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Error checking tables:', error.message);
    if (error.original) {
      console.error(`   Original: ${error.original.message}`);
    }
    console.error('');
    process.exit(1);
  }
}

checkTables();
