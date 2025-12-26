const express = require("express");
const { authMiddleware, allowExpiredUsers } = require( '../middleware/auth');
const { createOrder, verifyPayment } = require("../controllers/payment/paymentController");
const router = express.Router();

// Apply authentication middleware (allows expired users too)
// Payment routes should be accessible to expired users so they can upgrade
router.use(authMiddleware);
router.use(allowExpiredUsers); // Explicitly allow expired users for payment

// Note: Removed checkBusinessAccess to allow all business types to access payment
// Payment is universal across all business types

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
