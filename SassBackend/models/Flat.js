const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    aadhar: { type: String, required: true },
    mobile: { type: String, required: true },
    paymentHistory: [
      {
        amountPaid: { type: Number, required: true },
        paymentDate: { type: Date, default: Date.now },
      },
    ], 
    flatNumber:{type:Number, required: true,unique:true},

})
module.exports = mongoose.model("Flat",flatSchema)