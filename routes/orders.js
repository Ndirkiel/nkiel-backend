const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Import the Order model
const Course = require("../models/Course"); // Import the Course model for updates

// POST /api/orders: Process order and update course spaces
router.post("/", async (req, res) => {
    const { items } = req.body;
    
    try {
        // 1. Save the new order record
        const order = new Order(req.body);
        await order.save();

        // 2. ⭐ CRITICAL FIX: Loop through items and update course spaces
        if (items && Array.isArray(items)) {
            for (const item of items) {
                // Find the course by ID and decrement the spaces field using $inc
                await Course.findByIdAndUpdate(item.courseId, {
                    $inc: { spaces: -item.qty } // Decrement spaces by the quantity ordered
                });
            }
        }
        
        res.status(201).json({ success: true, message: "Order placed and courses updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: "Failed to place order or update courses" });
    }
});

module.exports = router;