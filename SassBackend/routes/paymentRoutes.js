const express = require("express");
const { authMiddleware, checkBusinessAccess } = require( '../middleware/auth');
const { createOrder, verifyPayment } = require("../controllers/payment/paymentController");
const router = express.Router();

// Apply middleware
router.use(authMiddleware);
router.use(checkBusinessAccess([ 'GYM','LIBRARY']));

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
