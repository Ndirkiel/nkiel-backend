const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Course = require("../models/Course");

// GET all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find(); // simple find
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer || !items || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Reduce spaces for each course
    for (let item of items) {
      const course = await Course.findById(item.courseId);
      if (!course) return res.status(404).json({ error: `Course not found: ${item.courseId}` });
      if (course.spaces < item.qty)
        return res.status(400).json({ error: `Not enough spaces for ${course.title}` });
      course.spaces -= item.qty;
      await course.save();
    }

    const order = new Order({ customer, items, total });
    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
