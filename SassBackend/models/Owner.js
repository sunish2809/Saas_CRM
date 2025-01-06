const mongoose = require('mongoose');
const ownerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
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
        enum: ['LIBRARY', 'GYM', 'FLAT'],
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

});
module.exports= mongoose.model("Owner",ownerSchema)