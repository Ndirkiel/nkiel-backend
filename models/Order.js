const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    notes: String,
    coupon: String
  },
  items: [
    {
      courseId: { type: String, required: true },
      title: String,
      price: Number,
      qty: Number
    }
  ],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
