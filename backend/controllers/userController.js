const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// 🔹 Get faculty by subject
const getFacultyBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.query;

  if (!subject) {
    return res.status(400).json({
      success: false,
      message: "Subject is required",
    });
  }

  const faculty = await User.find({
    role: "faculty",
    approved: true,
    courses: { $in: [subject] }  // 🔥 important change
  }).select("name email facultyId department courses");
// console.log("Incoming subject:", req.query.subject);
  res.status(200).json({
    success: true,
    count: faculty.length,
    data: faculty,
  });
});

module.exports = {
  getFacultyBySubject,
};