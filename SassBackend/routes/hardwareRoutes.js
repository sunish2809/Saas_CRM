const express = require("express");
const { authMiddleware, checkBusinessAccess } = require("../middleware/auth");
const {
  getAllProducts,
  addProduct,
  updateProductStock,
  getAllCustomers,
  getCustomerByPhone,
  updateCustomerDues,
  createBill,
  getCustomerBills,
} = require("../controllers/hardware/hardwareController");

const router = express.Router();

// Apply authentication & business access middleware
router.use(authMiddleware);
router.use(checkBusinessAccess(["HARDWARE"]));

// Product routes
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.put("/products/stock", updateProductStock);

// Customer routes
router.get("/customers", getAllCustomers);
router.get("/customers/:phoneNumber", getCustomerByPhone);
router.put("/customers/dues", updateCustomerDues);

// Bill routes
router.post("/bills", createBill);
router.get("/bills/:phoneNumber", getCustomerBills);

module.exports = router;

