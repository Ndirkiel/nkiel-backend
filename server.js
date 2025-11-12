// ----------------------
// Import dependencies
// ----------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// ----------------------
// Initialize app
// ----------------------
const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend (index.html, etc.)

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------------
// Routes
// ----------------------
app.use("/api/courses", require("./routes/courses"));
app.use("/api/orders", require("./routes/orders"));

// ----------------------
// Serve Frontend (index.html)
// ----------------------
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

// ----------------------
// Optional: Preload sample courses
// ----------------------
const Course = require("./models/Course");

const initialCourses = [
  {
    title: "English Basics",
    instructor: "John Doe",
    category: "English",
    location: "USA",
    price: 49.99,
    rating: 4.5,
    spaces: 10,
    cover: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  },
  {
    title: "French Advanced",
    instructor: "Marie Curie",
    category: "French",
    location: "France",
    price: 79.99,
    rating: 4.8,
    spaces: 8,
    cover: "https://cdn-icons-png.flaticon.com/512/1048/1048949.png",
  },
  {
    title: "Spanish Beginner",
    instructor: "Carlos Lopez",
    category: "Spanish",
    location: "Spain",
    price: 39.99,
    rating: 4.2,
    spaces: 12,
    cover: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
  },
];

async function preloadCourses() {
  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      console.log("📥 Seeding initial courses...");
      await Course.insertMany(initialCourses);
      console.log("✅ Initial courses added successfully.");
    }
  } catch (err) {
    console.error("❌ Error seeding courses:", err);
  }
}

preloadCourses();
