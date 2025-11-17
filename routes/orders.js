const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Order schema
const orderSchema = new mongoose.Schema({
  customer: Object,
  items: [{ courseId: String, qty: Number }],
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", orderSchema);

// POST order
router.post("/", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to place order" });
  }
});

module.exports = router;
