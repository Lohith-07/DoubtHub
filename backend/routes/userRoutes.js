const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getFacultyBySubject } = require("../controllers/userController");

// 🔹 Faculty by Subject
router.get("/faculty-by-subject", protect, getFacultyBySubject);

module.exports = router;