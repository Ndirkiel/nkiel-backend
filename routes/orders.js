const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create order
router.post("/", async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    if (!customer || !customer.name || !customer.email) {
      return res.status(400).json({ error: "Customer name and email are required" });
    }

    const newOrder = new Order({ customer, items, total });
    await newOrder.save();
    res.status(201).json({ message: "Order saved", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
