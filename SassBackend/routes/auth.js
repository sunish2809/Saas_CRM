const express = require('express');
const  { signIn, signUp, forgotPassword, resetPassword } = require( '../controllers/auth/authController');
const { googleSSO } = require('../controllers/auth/ssoController');


const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleSSO);

module.exports = router; 