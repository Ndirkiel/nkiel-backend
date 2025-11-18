const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// const path = require("path"); // ⬅️ KEEP COMMENTED OUT
require("dotenv").config();

const app = express();
// Render assigns a PORT environment variable, so this is correct for production:
const PORT = process.env.PORT || 3000; 

// Middleware
app.use(cors()); 
app.use(bodyParser.json());
// app.use(express.static("public")); // ⬅️ KEEP COMMENTED OUT

// MongoDB model (Requires ./models/Course.js)
const Course = require("./models/Course");

// Initial 21 courses
const initialCourses = [
  { title: "English Basics", instructor: "John Doe", category: "English", location: "USA", price: 49.99, rating: 4.5, spaces: 10, cover: "https://picsum.photos/seed/english/400/250" },
  { title: "French Advanced", instructor: "Marie Curie", category: "French", location: "France", price: 79.99, rating: 4.8, spaces: 8, cover: "https://picsum.photos/seed/french/400/250" },
  // ... (rest of your initial courses)
  { title: "Spanish Beginner", instructor: "Carlos Ruiz", category: "Spanish", location: "Spain", price: 39.99, rating: 4.2, spaces: 12, cover: "https://picsum.photos/seed/spanish/400/250" },
  // ... 
  { title: "Norwegian Basics", instructor: "Lars Hansen", category: "Norwegian", location: "Norway", price: 49.99, rating: 4.3, spaces: 8, cover: "https://picsum.photos/seed/norwegian/400/250" },
  { title: "Zulu Beginner", instructor: "Sipho Dlamini", category: "Zulu", location: "South Africa", price: 39.99, rating: 4.2, spaces: 10, cover: "https://picsum.photos/seed/zulu/400/250" }
];

// Preload ONLY IF EMPTY
async function preloadCourses() {
  const count = await Course.countDocuments();
  console.log("Courses currently in DB:", count);

  if (count === 0) {
    console.log("No courses found. Inserting initial courses...");
    await Course.insertMany(initialCourses);
    console.log("Initial courses inserted successfully.");
  } else {
    console.log("Courses already exist. Skipping preload.");
  }
}

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
    // Log for debugging environment info
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);

    await preloadCourses();

    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes - This is the API structure your frontend talks to
app.use("/api/courses", require("./routes/courses"));
app.use("/api/orders", require("./routes/orders"));

// KEEP THIS BLOCK COMMENTED OUT/REMOVED:
// app.get("/", (req, res) => { 
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });