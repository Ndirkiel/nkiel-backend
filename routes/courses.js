const express = require("express");
const router = express.Router();
const Course = require("../models/Course"); // Path must be correct

// GET /api/courses: Fetch all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/courses: Add a new course
router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    // 201 Created status is better practice for POST
    res.status(201).json(course); 
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to add course" });
  }
});

module.exports = router;