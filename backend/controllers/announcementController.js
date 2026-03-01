const asyncHandler = require("express-async-handler");
const Announcement = require("../models/Announcement");

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private (Admin Only)
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, message, priority, targetRole } = req.body;

    if (!title || !message) {
        res.status(400);
        throw new Error("Title and message are required");
    }

    const announcement = await Announcement.create({
        title,
        message,
        priority: priority || "low",
        targetRole: targetRole || "all",
        createdBy: req.user._id,
    });

    // Populate creator name for UI
    const populated = await announcement.populate("createdBy", "name");

    // Socket.io Real-time emission
    const io = req.app.get("socketio");
    if (io) {
        io.emit("newAnnouncement", populated);
    }

    res.status(201).json({
        success: true,
        data: populated,
    });
});

// @desc    Get announcements for the current user's role
// @route   GET /api/announcements
// @access  Private
const getAnnouncements = asyncHandler(async (req, res) => {
    const { priority, page = 1, limit = 10 } = req.query;
    let query = {
        $or: [{ targetRole: "all" }, { targetRole: req.user.role }],
    };

    if (priority) {
        query.priority = priority;
    }

    const skip = (page - 1) * limit;

    const total = await Announcement.countDocuments(query);
    const announcements = await Announcement.find(query)
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    res.status(200).json({
        success: true,
        count: announcements.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: announcements,
    });
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin Only)
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
        res.status(404);
        throw new Error("Announcement not found");
    }

    await announcement.deleteOne();

    res.status(200).json({
        success: true,
        message: "Announcement deleted successfully",
    });
});

module.exports = {
    createAnnouncement,
    getAnnouncements,
    deleteAnnouncement,
};
