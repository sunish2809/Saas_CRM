const mongoose = require('mongoose');
const ownerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    businessType: { type: String, enum: ['Flat', 'Gym', 'Library', 'Shop'], required: true },

});
module.exports= mongoose.model("Owner",ownerSchema)