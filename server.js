const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
// const path = require("path"); // No longer needed if not serving static files
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
// The cors() middleware is CRITICAL for allowing your front-end to connect
app.use(cors()); 
app.use(bodyParser.json());
// app.use(express.static("public")); // <-- REMOVED: No longer serving static files

// MongoDB model
const Course = require("./models/Course");

// Initial 21 courses (including Zulu Beginner)
const initialCourses = [
  { title: "English Basics", instructor: "John Doe", category: "English", location: "USA", price: 49.99, rating: 4.5, spaces: 10, cover: "https://picsum.photos/seed/english/400/250" },
  { title: "French Advanced", instructor: "Marie Curie", category: "French", location: "France", price: 79.99, rating: 4.8, spaces: 8, cover: "https://picsum.photos/seed/french/400/250" },
  { title: "Spanish Beginner", instructor: "Carlos Ruiz", category: "Spanish", location: "Spain", price: 39.99, rating: 4.2, spaces: 12, cover: "https://picsum.photos/seed/spanish/400/250" },
  { title: "German Intermediate", instructor: "Hans Müller", category: "German", location: "Germany", price: 59.99, rating: 4.6, spaces: 9, cover: "https://picsum.photos/seed/german/400/250" },
  { title: "Japanese Basics", instructor: "Yuki Tanaka", category: "Japanese", location: "Japan", price: 69.99, rating: 4.7, spaces: 7, cover: "https://picsum.photos/seed/japanese/400/250" },
  { title: "Chinese Advanced", instructor: "Li Wei", category: "Chinese", location: "China", price: 89.99, rating: 4.9, spaces: 5, cover: "https://picsum.photos/seed/chinese/400/250" },
  { title: "Italian Beginner", instructor: "Giovanni Rossi", category: "Italian", location: "Italy", price: 44.99, rating: 4.3, spaces: 10, cover: "https://picsum.photos/seed/italian/400/250" },
  { title: "Arabic Basics", instructor: "Fatima Al-Zahra", category: "Arabic", location: "Egypt", price: 54.99, rating: 4.5, spaces: 8, cover: "https://picsum.photos/seed/arabic/400/250" },
  { title: "Russian Intermediate", instructor: "Ivan Petrov", category: "Russian", location: "Russia", price: 64.99, rating: 4.4, spaces: 9, cover: "https://picsum.photos/seed/russian/400/250" },
  { title: "Portuguese Beginner", instructor: "Ana Silva", category: "Portuguese", location: "Brazil", price: 49.99, rating: 4.2, spaces: 10, cover: "https://picsum.photos/seed/portuguese/400/250" },
  { title: "Korean Basics", instructor: "Kim Minsoo", category: "Korean", location: "South Korea", price: 59.99, rating: 4.6, spaces: 6, cover: "https://picsum.photos/seed/korean/400/250" },
  { title: "Hindi Intermediate", instructor: "Ravi Kumar", category: "Hindi", location: "India", price: 69.99, rating: 4.5, spaces: 7, cover: "https://picsum.photos/seed/hindi/400/250" },
  { title: "Swahili Beginner", instructor: "Amina Chui", category: "Swahili", location: "Kenya", price: 39.99, rating: 4.1, spaces: 12, cover: "https://picsum.photos/seed/swahili/400/250" },
  { title: "Turkish Basics", instructor: "Ahmet Yilmaz", category: "Turkish", location: "Turkey", price: 49.99, rating: 4.3, spaces: 9, cover: "https://picsum.photos/seed/turkish/400/250" },
  { title: "Dutch Advanced", instructor: "Sophie Janssen", category: "Dutch", location: "Netherlands", price: 79.99, rating: 4.7, spaces: 5, cover: "https://picsum.photos/seed/dutch/400/250" },
  { title: "Greek Beginner", instructor: "Nikos Papadopoulos", category: "Greek", location: "Greece", price: 44.99, rating: 4.2, spaces: 8, cover: "https://picsum.photos/seed/greek/400/250" },
  { title: "Hebrew Basics", instructor: "Yael Cohen", category: "Hebrew", location: "Israel", price: 54.99, rating: 4.5, spaces: 7, cover: "https://picsum.photos/seed/hebrew/400/250" },
  { title: "Polish Intermediate", instructor: "Jan Kowalski", category: "Polish", location: "Poland", price: 64.99, rating: 4.4, spaces: 6, cover: "https://picsum.photos/seed/polish/400/250" },
  { title: "Vietnamese Beginner", instructor: "Nguyen Thi", category: "Vietnamese", location: "Vietnam", price: 39.99, rating: 4.1, spaces: 12, cover: "https://picsum.photos/seed/vietnamese/400/250" },
  { title: "Norwegian Basics", instructor: "Lars Hansen", category: "Norwegian", location: "Norway", price: 49.99, rating: 4.3, spaces: 8, cover: "https://picsum.photos/seed/norwegian/400/250" },

  // Extra course to make 21
  { title: "Zulu Beginner", instructor: "Sipho Dlamini", category: "Zulu", location: "South Africa", price: 39.99, rating: 4.2, spaces: 10, cover: "https://picsum.photos/seed/zulu/400/250" }
];

// Preload ONLY IF EMPTY
async function preloadCourses() {
  // ... (Preload logic remains the same)
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

// app.get("/", (req, res) => { // <-- REMOVED: This was causing the ENOENT error
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });