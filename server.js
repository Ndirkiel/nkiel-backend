const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------
// Middlewares
// ----------------------
app.use(cors());
app.use(express.json());

// ----------------------
// MongoDB Connection
// ----------------------
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// ----------------------
// Example Schema & Model
// ----------------------
const courseSchema = new mongoose.Schema({
    title: String,
    instructor: String,
    category: String,
    price: Number
});

const Course = mongoose.model("Course", courseSchema);

// ----------------------
// API Routes
// ----------------------
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.get("/courses", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ----------------------
// Start Server
// ----------------------
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
