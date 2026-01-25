#!/usr/bin/env node

/**
 * Server Diagnostic Script
 * Comprehensive check of server configuration, dependencies, and environment
 * 
 * Usage: node scripts/diagnose.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║           Server Diagnostic Tool                            ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let issues = [];
let warnings = [];

// Check Node.js version
console.log('📋 Node.js Version:');
const nodeVersion = process.version;
console.log(`   ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1).split('.')[0]) < 18) {
  issues.push('Node.js version should be 18.x or higher');
} else {
  console.log('   ✅ Version OK\n');
}

// Check .env file
console.log('📄 Environment File (.env):');
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file exists');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check required variables
  const requiredVars = {
    'NODE_ENV': 'production',
    'DB_ENGINE': 'mysql',
    'DB_HOST': 'localhost',
    'DB_NAME': 'your_database_name',
    'DB_USER': 'your_database_user',
    'DB_PASSWORD': 'your_database_password',
    'SESSION_SECRET': 'your-secret-key'
  };
  
  console.log('\n   Required Variables:');
  for (const [varName, example] of Object.entries(requiredVars)) {
    if (process.env[varName]) {
      if (varName === 'DB_PASSWORD' || varName === 'SESSION_SECRET') {
        console.log(`   ✅ ${varName}: ***`);
      } else {
        console.log(`   ✅ ${varName}: ${process.env[varName]}`);
      }
    } else {
      console.log(`   ❌ ${varName}: NOT SET`);
      issues.push(`Missing environment variable: ${varName}`);
    }
  }
  
  // Check if using example values
  if (envContent.includes('your_database_name') || 
      envContent.includes('your_database_user') ||
      envContent.includes('your-secret-key-change-this')) {
    warnings.push('Environment file contains example/placeholder values');
  }
} else {
  console.log('   ❌ .env file NOT FOUND');
  issues.push('.env file is missing');
}
console.log('');

// Check package.json and dependencies
console.log('📦 Dependencies:');
const packagePath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packagePath)) {
  console.log('   ✅ package.json exists');
  
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    console.log('   ✅ node_modules exists');
    
    // Check critical dependencies
    const criticalDeps = ['express', 'sequelize', 'ejs', 'mysql2'];
    console.log('\n   Critical Dependencies:');
    for (const dep of criticalDeps) {
      const depPath = path.join(nodeModulesPath, dep);
      if (fs.existsSync(depPath)) {
        console.log(`   ✅ ${dep}`);
      } else {
        console.log(`   ❌ ${dep}: MISSING`);
        issues.push(`Missing dependency: ${dep}`);
      }
    }
  } else {
    console.log('   ❌ node_modules NOT FOUND');
    issues.push('Dependencies not installed. Run: npm install');
  }
} else {
  console.log('   ❌ package.json NOT FOUND');
  issues.push('package.json is missing');
}
console.log('');

// Check directory structure
console.log('📁 Directory Structure:');
const requiredDirs = [
  'config',
  'controllers',
  'models',
  'routes',
  'views',
  'public',
  'uploads'
];

for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/: MISSING`);
    issues.push(`Missing directory: ${dir}`);
  }
}
console.log('');

// Check critical files
console.log('📄 Critical Files:');
const criticalFiles = [
  'server.js',
  'config/database.js',
  'routes/index.js'
];

for (const file of criticalFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file}: MISSING`);
    issues.push(`Missing file: ${file}`);
  }
}
console.log('');

// Test database connection
console.log('🔌 Database Connection:');
if (process.env.DB_ENGINE === 'mysql' && process.env.DB_NAME && process.env.DB_USER) {
  try {
    const { testConnection } = require('../config/database');
    const connected = await testConnection();
    if (connected) {
      console.log('   ✅ Database connection successful\n');
    } else {
      console.log('   ❌ Database connection failed\n');
      issues.push('Database connection failed. Check credentials.');
    }
  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}\n`);
    issues.push(`Database error: ${error.message}`);
  }
} else {
  console.log('   ⚠️  Skipping (DB_ENGINE not set to mysql or credentials missing)\n');
  warnings.push('Database connection test skipped');
}

// Summary
console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║                      DIAGNOSTIC SUMMARY                      ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

if (issues.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Your server configuration looks good.\n');
  process.exit(0);
} else {
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }
  
  if (issues.length > 0) {
    console.log('❌ Issues Found:');
    issues.forEach(i => console.log(`   - ${i}`));
    console.log('\n🔧 Next Steps:');
    console.log('   1. Fix the issues listed above');
    console.log('   2. Run: npm install (if dependencies are missing)');
    console.log('   3. Create/update .env file with correct values');
    console.log('   4. Test database: node scripts/test-db.js');
    console.log('   5. Restart the application\n');
    process.exit(1);
  } else {
    console.log('✅ No critical issues found. Warnings can be addressed later.\n');
    process.exit(0);
  }
}
