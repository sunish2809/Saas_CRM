const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, "Amount cannot be negative"],
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, "Amount cannot be negative"],
  },
  dueAmount: {
    type: Number,
    default: 0,
    min: [0, "Amount cannot be negative"],
  },
  bills: [
    {
      billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
      },
      billDate: {
        type: Date,
        default: Date.now,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      paidAmount: {
        type: Number,
        default: 0,
      },
      dueAmount: {
        type: Number,
        default: 0,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-update `updatedAt` before saving
customerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  // Calculate due amount
  this.dueAmount = this.totalAmount - this.paidAmount;
  next();
});

// Index for faster queries - phone number should be unique per owner
customerSchema.index({ ownerId: 1, phoneNumber: 1 }, { unique: true });

module.exports = mongoose.model("Customer", customerSchema);

