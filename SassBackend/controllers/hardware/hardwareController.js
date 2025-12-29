const Product = require("../../models/Product");
const Customer = require("../../models/Customer");
const Bill = require("../../models/Bill");

// ============ PRODUCT CONTROLLERS ============

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ ownerId: req.owner._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Add new product
exports.addProduct = async (req, res) => {
  try {
    const { name, quantities } = req.body;

    if (!name || !quantities || !Array.isArray(quantities) || quantities.length === 0) {
      return res.status(400).json({
        message: "Product name and at least one quantity with stock are required",
      });
    }

    // Validate quantities
    for (const qty of quantities) {
      if (!qty.quantity || qty.stock === undefined || qty.stock < 0) {
        return res.status(400).json({
          message: "Each quantity must have a quantity string and non-negative stock",
        });
      }
    }

    const product = new Product({
      ownerId: req.owner._id,
      name: name.trim(),
      quantities: quantities.map((q) => ({
        quantity: q.quantity.trim(),
        stock: Number(q.stock),
      })),
    });

    await product.save();
    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

// Update product stock
exports.updateProductStock = async (req, res) => {
  try {
    const { productId, quantity, newStock } = req.body;

    if (!productId || !quantity || newStock === undefined || newStock < 0) {
      return res.status(400).json({
        message: "Product ID, quantity, and valid stock value are required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      ownerId: req.owner._id,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find and update the specific quantity
    const quantityIndex = product.quantities.findIndex(
      (q) => q.quantity === quantity.trim()
    );

    if (quantityIndex === -1) {
      return res.status(404).json({
        message: `Quantity "${quantity}" not found for this product`,
      });
    }

    product.quantities[quantityIndex].stock = Number(newStock);
    await product.save();

    res.json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating stock",
      error: error.message,
    });
  }
};

// ============ CUSTOMER CONTROLLERS ============

// Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ ownerId: req.owner._id })
      .select("name phoneNumber totalAmount paidAmount dueAmount")
      .sort({ createdAt: -1 });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customers",
      error: error.message,
    });
  }
};

// Get customer by phone number
exports.getCustomerByPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const customer = await Customer.findOne({
      ownerId: req.owner._id,
      phoneNumber: phoneNumber.trim(),
    }).populate({
      path: "bills.billId",
      model: "Bill",
      populate: {
        path: "items.productId",
        model: "Product",
        select: "name",
      },
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching customer",
      error: error.message,
    });
  }
};

// Update customer dues
exports.updateCustomerDues = async (req, res) => {
  try {
    const { phoneNumber, paidAmount } = req.body;

    if (!phoneNumber || paidAmount === undefined || paidAmount < 0) {
      return res.status(400).json({
        message: "Phone number and valid paid amount are required",
      });
    }

    const customer = await Customer.findOne({
      ownerId: req.owner._id,
      phoneNumber: phoneNumber.trim(),
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    customer.paidAmount = Number(customer.paidAmount) + Number(paidAmount);
    customer.dueAmount = customer.totalAmount - customer.paidAmount;

    if (customer.dueAmount < 0) {
      return res.status(400).json({
        message: "Paid amount cannot exceed total amount",
      });
    }

    await customer.save();

    res.json({
      message: "Customer dues updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating customer dues",
      error: error.message,
    });
  }
};

// ============ BILL CONTROLLERS ============

// Create a new bill
exports.createBill = async (req, res) => {
  try {
    const { items, customerName, phoneNumber, paidAmount } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one item is required",
      });
    }

    if (!customerName || !phoneNumber) {
      return res.status(400).json({
        message: "Customer name and phone number are required",
      });
    }

    // Find or create customer
    let customer = await Customer.findOne({
      ownerId: req.owner._id,
      phoneNumber: phoneNumber.trim(),
    });

    if (!customer) {
      customer = new Customer({
        ownerId: req.owner._id,
        name: customerName.trim(),
        phoneNumber: phoneNumber.trim(),
        totalAmount: 0,
        paidAmount: 0,
        dueAmount: 0,
      });
    }

    // Process items and calculate total
    let totalAmount = 0;
    const billItems = [];

    for (const item of items) {
      const { productId, quantity, count, unitPrice } = item;

      if (!productId || !quantity || !count || unitPrice === undefined) {
        return res.status(400).json({
          message: "Each item must have productId, quantity, count, and unitPrice",
        });
      }

      // Get product details
      const product = await Product.findOne({
        _id: productId,
        ownerId: req.owner._id,
      });

      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${productId} not found`,
        });
      }

      // Check if quantity exists and has enough stock
      const quantityObj = product.quantities.find(
        (q) => q.quantity === quantity.trim()
      );

      if (!quantityObj) {
        return res.status(404).json({
          message: `Quantity "${quantity}" not found for product "${product.name}"`,
        });
      }

      if (quantityObj.stock < count) {
        return res.status(400).json({
          message: `Insufficient stock. Available: ${quantityObj.stock}, Requested: ${count}`,
        });
      }

      // Update stock
      quantityObj.stock -= count;
      await product.save();

      const totalPrice = Number(count) * Number(unitPrice);
      totalAmount += totalPrice;

      billItems.push({
        productId: product._id,
        productName: product.name,
        quantity: quantity.trim(),
        count: Number(count),
        unitPrice: Number(unitPrice),
        totalPrice,
      });
    }

    // Create bill
    const bill = new Bill({
      ownerId: req.owner._id,
      customerId: customer._id,
      customerPhoneNumber: phoneNumber.trim(),
      items: billItems,
      totalAmount,
      paidAmount: paidAmount ? Number(paidAmount) : 0,
      dueAmount: totalAmount - (paidAmount ? Number(paidAmount) : 0),
    });

    await bill.save();

    // Update customer
    customer.totalAmount = Number(customer.totalAmount) + totalAmount;
    customer.paidAmount = Number(customer.paidAmount) + (paidAmount ? Number(paidAmount) : 0);
    customer.dueAmount = customer.totalAmount - customer.paidAmount;

    customer.bills.push({
      billId: bill._id,
      billDate: bill.billDate,
      totalAmount: bill.totalAmount,
      paidAmount: bill.paidAmount,
      dueAmount: bill.dueAmount,
    });

    await customer.save();

    res.status(201).json({
      message: "Bill created successfully",
      bill,
      customer,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }
    res.status(500).json({
      message: "Error creating bill",
      error: error.message,
    });
  }
};

// Get all bills for a customer
exports.getCustomerBills = async (req, res) => {
  try {
    const { phoneNumber } = req.params;

    const bills = await Bill.find({
      ownerId: req.owner._id,
      customerPhoneNumber: phoneNumber.trim(),
    })
      .populate("items.productId", "name")
      .sort({ billDate: -1 });

    res.json(bills);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching bills",
      error: error.message,
    });
  }
};

