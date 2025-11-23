const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Course Model
const courseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  category: String,
  location: String,
  price: Number,
  rating: Number,
  spaces: Number,
  cover: String,
});
const Course = mongoose.model("Course", courseSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  customer: Object,
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model("Order", orderSchema);

// Seed initial courses if not present
const initialCourses = [
  // Add your courses here or leave empty
];

Course.countDocuments().then(count => {
  if(count === 0) {
    Course.insertMany(initialCourses).then(() => console.log("Courses seeded"));
  }
});

// === API Routes ===

// Get all courses
app.get("/courses", async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

// Create order
app.post("/orders", async (req, res) => {
  try {
    const { customer, items, total } = req.body;
    const order = new Order({ customer, items, total });
    await order.save();

    // Update spaces in courses
    for (const item of items) {
      await Course.findByIdAndUpdate(item.courseId, { $inc: { spaces: -item.qty } });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Catch-all to serve index.html for frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
