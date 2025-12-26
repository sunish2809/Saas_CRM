const mongoose = require("mongoose");

const ownerSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    // Legacy field - kept for backward compatibility, will be the first business type
    businessType: {
      type: String,
      enum: ["GYM", "LIBRARY"],
      uppercase: true,
    },
    // New field - array of business types user has access to
    businessTypes: {
      type: [String],
      enum: ["GYM", "LIBRARY"],
      default: [],
    },
    // Current active business type (for dashboard routing)
    currentBusinessType: {
      type: String,
      enum: ["GYM", "LIBRARY"],
      uppercase: true,
    },
    trialStatus: {
      type: String,
      enum: ["TRIAL", "MEMBER","EXPIRED"],
      default: "TRIAL",
    },
    trialStartDate: { type: Date, default: Date.now },
    membershipType: {
      type: String,
      enum: ["Starter", "Professional", "Enterprise", "Lifetime", "Basic", "Intermediate", "Pro", "None"],
      default: "None",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Virtual to get all business types (prioritize businessTypes array, fallback to businessType)
ownerSchema.virtual('allBusinessTypes').get(function() {
  if (this.businessTypes && this.businessTypes.length > 0) {
    return this.businessTypes;
  }
  if (this.businessType) {
    return [this.businessType];
  }
  return [];
});

// Pre-save middleware to sync businessType with businessTypes array and normalize membershipType
ownerSchema.pre('save', function(next) {
  // Normalize membershipType - convert "Starter Plan" to "Starter" and handle other variations
  if (this.membershipType) {
    const normalized = this.membershipType.trim();
    if (normalized === "Starter Plan" || normalized === "starter plan" || normalized === "STARTER PLAN") {
      this.membershipType = "Starter";
    } else if (normalized === "Professional Plan" || normalized === "professional plan" || normalized === "PROFESSIONAL PLAN") {
      this.membershipType = "Professional";
    } else if (normalized === "Enterprise Plan" || normalized === "enterprise plan" || normalized === "ENTERPRISE PLAN") {
      this.membershipType = "Enterprise";
    } else if (normalized === "Lifetime Plan" || normalized === "lifetime plan" || normalized === "LIFETIME PLAN") {
      this.membershipType = "Lifetime";
    }
  }
  
  // If businessTypes array is empty but businessType exists, populate it
  if ((!this.businessTypes || this.businessTypes.length === 0) && this.businessType) {
    this.businessTypes = [this.businessType];
  }
  
  // If businessType is not set but businessTypes has items, set businessType to first item
  if (!this.businessType && this.businessTypes && this.businessTypes.length > 0) {
    this.businessType = this.businessTypes[0];
  }
  
  // Set currentBusinessType if not set
  if (!this.currentBusinessType) {
    if (this.businessTypes && this.businessTypes.length > 0) {
      this.currentBusinessType = this.businessTypes[0];
    } else if (this.businessType) {
      this.currentBusinessType = this.businessType;
    }
  }
  
  next();
});

// Index on email only (one account per email)
ownerSchema.index({ email: 1 }, { unique: true });

// Legacy index for backward compatibility (but not unique anymore)
ownerSchema.index({ email: 1, businessType: 1 });

module.exports = mongoose.model("Owner", ownerSchema);
