const express = require('express');
const  { signIn, signUp, forgotPassword, resetPassword } = require( '../controllers/auth/authController');


const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router; 