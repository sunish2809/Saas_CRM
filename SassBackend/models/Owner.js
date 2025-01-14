const mongoose = require('mongoose');

const ownerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
    enum: ['GYM', 'LIBRARY', 'FLAT'],
    uppercase: true,
  },
}, { timestamps: true });

// Remove any existing indexes
ownerSchema.indexes().forEach(index => {
  ownerSchema.index(index.fields, { unique: false });
});

// Create a compound unique index on email and businessType
ownerSchema.index({ email: 1, businessType: 1 }, { unique: true });

const Owner = mongoose.model('Owner', ownerSchema);

module.exports = Owner;