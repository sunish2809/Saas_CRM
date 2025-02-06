const Razorpay = require("razorpay");
const crypto = require("crypto");
const Owner = require("../../models/Owner");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise (₹1 = 100 paise)
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    // ✅ Find owner using token (from auth middleware)
    const owner = await Owner.findById(req.user.userId);

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // ✅ Update owner's trial status and membership type
    owner.trialStatus = "MEMBER";
    owner.membershipType = req.body.membershipType;
    await owner.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Payment successful & membership updated",
      });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Error verifying payment" });
  }
};
