const express = require("express");
const router = express.Router();
const Course = require("../models/Course"); 

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/", async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    
    res.status(201).json(course); 
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to add course" });
  }
});

module.exports = router;