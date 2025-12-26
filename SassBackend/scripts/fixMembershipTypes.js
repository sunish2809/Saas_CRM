const mongoose = require('mongoose');
const Owner = require('../models/Owner');
require('dotenv').config();

const membershipTypeMappings = {
  'Starter Plan': 'Starter',
  'starter plan': 'Starter',
  'STARTER PLAN': 'Starter',
  'Professional Plan': 'Professional',
  'professional plan': 'Professional',
  'PROFESSIONAL PLAN': 'Professional',
  'Enterprise Plan': 'Enterprise',
  'enterprise plan': 'Enterprise',
  'ENTERPRISE PLAN': 'Enterprise',
  'Lifetime Plan': 'Lifetime',
  'lifetime plan': 'Lifetime',
  'LIFETIME PLAN': 'Lifetime',
};

async function fixMembershipTypes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database');
    console.log('Connected to MongoDB');

    // Find all owners with invalid membership types
    const owners = await Owner.find({});
    console.log(`Found ${owners.length} owners to check`);

    let updatedCount = 0;
    for (const owner of owners) {
      const currentType = owner.membershipType;
      
      // Check if it needs to be fixed
      if (currentType && membershipTypeMappings[currentType]) {
        const newType = membershipTypeMappings[currentType];
        console.log(`Updating owner ${owner.email}: "${currentType}" -> "${newType}"`);
        owner.membershipType = newType;
        await owner.save();
        updatedCount++;
      }
    }

    console.log(`\n✅ Fixed ${updatedCount} owner(s)`);
    console.log('Done!');

  } catch (error) {
    console.error('Error fixing membership types:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the script
fixMembershipTypes();

