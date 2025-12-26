/**
 * Script to create demo accounts for visitors to try the platform
 * 
 * Run with: node scripts/createDemoAccounts.js
 * 
 * This will create demo accounts for:
 * - Gym Management (demo.gym@example.com)
 * - Library Management (demo.library@example.com)
 * 
 * All with password: Demo@1234
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Owner = require('../models/Owner');
require('dotenv').config();

const DEMO_ACCOUNTS = [
  {
    email: 'demo.gym@example.com',
    password: 'Demo@1234',
    name: 'Demo Gym Owner',
    businessType: 'GYM',
    membershipType: 'Professional', // Give demo accounts Professional plan to show all features
    trialStatus: 'MEMBER',
  },
  {
    email: 'demo.library@example.com',
    password: 'Demo@1234',
    name: 'Demo Library Owner',
    businessType: 'LIBRARY',
    membershipType: 'Professional',
    trialStatus: 'MEMBER',
  },
];

async function createDemoAccounts() {
  try {
    // Connect to MongoDB - use the same connection string as the main app
    // The db.js uses MONGOURL environment variable
    const mongoUri = process.env.MONGOURL || process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    for (const account of DEMO_ACCOUNTS) {
      try {
        // Check if account already exists
        const existing = await Owner.findOne({ email: account.email });
        
        if (existing) {
          console.log(`✅ Account ${account.email} already exists, updating...`);
          
          // Update existing account
          const hashedPassword = await bcrypt.hash(account.password, 10);
          existing.password = hashedPassword;
          existing.name = account.name;
          existing.businessType = account.businessType;
          existing.businessTypes = [account.businessType];
          existing.currentBusinessType = account.businessType;
          existing.membershipType = account.membershipType;
          existing.trialStatus = account.trialStatus;
          await existing.save();
          
          console.log(`   Updated: ${account.email}`);
        } else {
          // Create new account
          const hashedPassword = await bcrypt.hash(account.password, 10);
          const newOwner = await Owner.create({
            email: account.email,
            password: hashedPassword,
            name: account.name,
            businessType: account.businessType,
            businessTypes: [account.businessType],
            currentBusinessType: account.businessType,
            membershipType: account.membershipType,
            trialStatus: account.trialStatus,
            trialStartDate: new Date(),
          });
          
          console.log(`✅ Created: ${account.email} (${account.businessType})`);
        }
      } catch (error) {
        console.error(`❌ Error creating/updating ${account.email}:`, error.message);
      }
    }

    console.log('\n✅ Demo accounts setup complete!');
    console.log('\nDemo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    DEMO_ACCOUNTS.forEach(acc => {
      console.log(`${acc.businessType}:`);
      console.log(`  Email: ${acc.email}`);
      console.log(`  Password: ${acc.password}`);
      console.log('');
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('Error creating demo accounts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the script
createDemoAccounts();

