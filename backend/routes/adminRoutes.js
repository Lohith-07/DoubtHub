const express = require("express");
const router = express.Router();

const { protect, isAdmin } = require("../middleware/authMiddleware");

const {
  getPendingFaculty,
  approveFaculty,
  getStats,
  rejectFaculty,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");



// 🔹 View pending faculty
router.get("/pending-faculty", protect, isAdmin, getPendingFaculty);

// 🔹 Approve faculty
router.put("/approve/:id", protect, isAdmin, approveFaculty);

// 🔹 Get system stats
router.get("/stats", protect, isAdmin, getStats)

// 🔹 Reject faculty
router.delete("/reject/:id", protect, isAdmin, rejectFaculty)

// 🔹 User Management
router.get("/all-users", protect, isAdmin, getAllUsers);
router.delete("/user/:id", protect, isAdmin, deleteUser);


module.exports = router;