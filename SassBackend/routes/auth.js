const express = require('express');
const  { signIn,signUp } = require( '../controllers/auth/authController');


const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
//router.post('/update-metadata', authMiddleware, authController.updateUserMetadata);
module.exports = router; 