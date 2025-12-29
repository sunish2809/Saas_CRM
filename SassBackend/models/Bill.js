const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Owner",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  customerPhoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      productName: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true, // e.g., "200 ml", "2 kg"
      },
      count: {
        type: Number,
        required: true,
        min: [1, "Count must be at least 1"],
      },
      unitPrice: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"],
      },
      totalPrice: {
        type: Number,
        required: true,
        min: [0, "Total price cannot be negative"],
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: [0, "Total amount cannot be negative"],
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: [0, "Paid amount cannot be negative"],
  },
  dueAmount: {
    type: Number,
    default: 0,
    min: [0, "Due amount cannot be negative"],
  },
  billDate: {
    type: Date,
    default: Date.now,
  },
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
billSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  // Calculate due amount
  this.dueAmount = this.totalAmount - this.paidAmount;
  next();
});

// Index for faster queries
billSchema.index({ ownerId: 1, customerId: 1 });
billSchema.index({ ownerId: 1, customerPhoneNumber: 1 });
billSchema.index({ ownerId: 1, billDate: -1 });

module.exports = mongoose.model("Bill", billSchema);

