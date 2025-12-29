const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
  quantities: [
    {
      quantity: {
        type: String,
        required: true,
        trim: true, // e.g., "1 kg", "500 ml", "2 liters"
      },
      stock: {
        type: Number,
        required: true,
        min: [0, "Stock cannot be negative"],
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
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
productSchema.index({ ownerId: 1, name: 1 });

module.exports = mongoose.model("Product", productSchema);

