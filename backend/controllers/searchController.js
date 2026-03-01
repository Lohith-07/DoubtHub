const asyncHandler = require("express-async-handler");
const Doubt = require("../models/Doubt");
const Notes = require("../models/Notes");
const Announcement = require("../models/Announcement");

// @desc    Global search across all modules
// @route   GET /api/search
// @access  Private
const globalSearch = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        return res.status(200).json({
            success: true,
            data: { doubts: [], notes: [], announcements: [] },
        });
    }

    const searchRegex = new RegExp(q, "i");

    // Parallel searching for better performance
    const [doubts, notes, announcements] = await Promise.all([
        Doubt.find({
            $or: [
                { title: searchRegex },
                { subject: searchRegex },
                { tags: searchRegex },
            ],
        })
            .populate("postedBy", "name")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        Notes.find({
            $or: [{ title: searchRegex }, { subject: searchRegex }],
        })
            .populate("uploadedBy", "name")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),

        Announcement.find({
            $or: [{ title: searchRegex }, { message: searchRegex }],
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .lean(),
    ]);

    res.status(200).json({
        success: true,
        data: {
            doubts,
            notes,
            announcements,
        },
    });
});

module.exports = { globalSearch };
