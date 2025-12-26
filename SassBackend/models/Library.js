const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema({
    ownerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Owner', 
        required: true 
    },
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    email: { 
        type: String, 
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: { 
        type: String, 
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    address: { 
        type: String, 
        required: true,
        trim: true 
    },
    seatNumber: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    aadharNumber: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhar number']
    },
    emergencyContact: { 
        type: String, 
        required: true,
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit emergency contact number']
    },
    gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female', 'Other'],
        trim: true 
    },
    dateOfBirth: { 
        type: Date, 
        required: true 
    },
    membershipType: { 
        type: String, 
        enum: ['Basic', 'Standard', 'Premium', 'Annual'],
        required: true,
        default: 'Basic'
    },
    paymentHistory: [{
        amount: { 
            type: Number, 
            required: true,
            min: [0, 'Amount cannot be negative']
        },
        paymentDate: { 
            type: Date, 
            default: Date.now 
        }
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Update timestamp on save
librarySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Library", librarySchema);