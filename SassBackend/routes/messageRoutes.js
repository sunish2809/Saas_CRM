const express = require('express');
const { authMiddleware, checkBusinessAccess } = require('../middleware/auth');
const {automateMessage} = require('../controllers/message/messageController')

//import twilio from "twilio";
const router = express.Router();


// Apply middleware to all routes
router.use(authMiddleware);
router.use(checkBusinessAccess(['LIBRARY']));

router.post('/send-sms',automateMessage)

module.exports = router;
