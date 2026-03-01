const express = require("express");
const router = express.Router();
const {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect, isFacultyOrAdmin, isAdmin } = require("../middleware/authMiddleware");

router.post("/", protect, isFacultyOrAdmin, createAnnouncement);
router.get("/", protect, getAnnouncements);
router.delete("/:id", protect, isFacultyOrAdmin, deleteAnnouncement);

module.exports = router;
