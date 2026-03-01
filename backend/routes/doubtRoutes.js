const express = require("express");
const router = express.Router();

const {
  createDoubt,
  getAllDoubts,
  getSingleDoubt,
  answerDoubt,
  assignDoubt,
  toggleUpvote,
  getTrendingDoubts,
  addReply,
  deleteReply,
  updateDoubt,
  deleteDoubt,
} = require("../controllers/doubtController");

const { protect, isStudent, isFaculty, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, isStudent, createDoubt);
router.get("/trending", protect, getTrendingDoubts); // 🔥 TRENDING FIRST
router.get("/", protect, getAllDoubts);

// 🔥 SPECIFIC ROUTES FIRST
router.put("/:id/upvote", protect, toggleUpvote);
router.put("/:id", protect, isFaculty, answerDoubt);

// 🔥 GENERIC ROUTE LAST
router.put("/:id/assign", protect, isAdmin, assignDoubt)
router.post("/:id/reply", protect, addReply);
router.delete("/:id/reply/:replyId", protect, deleteReply);
router.put("/:id/edit", protect, updateDoubt);
router.delete("/:id", protect, deleteDoubt);
router.get("/:id", protect, getSingleDoubt);


module.exports = router;