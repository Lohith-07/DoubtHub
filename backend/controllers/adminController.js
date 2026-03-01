const User = require("../models/User");
const Doubt = require("../models/Doubt");
const asyncHandler = require("express-async-handler");

// 🔹 View pending faculty
const getPendingFaculty = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "faculty", approved: false });
  res.json(users);
});

// 🔹 Approve faculty
const approveFaculty = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role !== "faculty") {
    res.status(404);
    throw new Error("Faculty not found");
  }

  user.approved = true;
  await user.save();

  res.json({ message: "Faculty approved successfully" });
});


const getStats = asyncHandler(async (req, res) => {
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalFaculty = await User.countDocuments({ role: "faculty", approved: true });
  const pendingFaculty = await User.countDocuments({ role: "faculty", approved: false });
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalDoubts = await Doubt.countDocuments();
  const resolvedDoubts = await Doubt.countDocuments({ status: "answered" });
  const pendingDoubts = await Doubt.countDocuments({ status: "pending" });

  res.json({
    totalStudents,
    totalFaculty,
    pendingFaculty,
    totalAdmins,
    totalDoubts,
    resolvedDoubts,
    pendingDoubts,
    pendingDoubts,
  });
});


// 🔹 Get all users (students and faculty)
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, role } = req.query; // Default limit to 5 for visibility

  const pageNumber = Number(page);
  const pageSize = Number(limit);

  let filter = { role: { $in: ["student", "faculty"] } };

  if (role && ["student", "faculty"].includes(role)) {
    filter.role = role;
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.json({
    users,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
  });
});



// 🔹 Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent deleting admins via this route for safety
  if (user.role === "admin") {
    res.status(403);
    throw new Error("Cannot delete admin users");
  }

  await user.deleteOne();
  res.json({ message: "User removed successfully" });
});

// 🔹 Reject faculty
const rejectFaculty = asyncHandler(async (req, res) => {
  const faculty = await User.findById(req.params.id);

  if (!faculty || faculty.role !== "faculty") {
    res.status(404);
    throw new Error("Faculty not found");
  }

  await faculty.deleteOne();

  res.json({ message: "Faculty rejected and removed" });
});

module.exports = {
  getStats,
  rejectFaculty,
  getAllUsers,
  deleteUser,
  getPendingFaculty,
  approveFaculty,
};

