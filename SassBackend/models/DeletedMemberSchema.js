const mongoose = require('mongoose');

const DeletedMemberSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

const DeletedMember = mongoose.model('DeletedMember', DeletedMemberSchema);

module.exports = DeletedMember;
