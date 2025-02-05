// import React from 'react'

// const DeletedGymMemberSchema = () => {
//   return (
//     <div>
      
//     </div>
//   )
// }

// export default DeletedGymMemberSchema

const mongoose = require('mongoose');

const DeletedGymMemberSchema = new mongoose.Schema({
    memberNumber: {
    type: String,
    required: true,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

const DeletedMemberGym = mongoose.model('DeletedMemberGym', DeletedGymMemberSchema);

module.exports = DeletedMemberGym;