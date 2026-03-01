const asyncHandler = require("express-async-handler");
const Doubt = require("../models/Doubt");
const Notes = require("../models/Notes");
const Announcement = require("../models/Announcement");

// @desc    Get user-specific and system stats for dashboard
// @route   GET /api/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { role } = req.user;

    let stats = {};

    if (role === "student") {
        const [totalDoubts, resolvedDoubts, totalNotes, announcements] = await Promise.all([
            Doubt.countDocuments({ postedBy: userId }),
            Doubt.countDocuments({ postedBy: userId, status: "answered" }),
            Notes.countDocuments({}),
            Announcement.countDocuments({}),
        ]);
        stats = {
            primary: { label: "My Doubts", value: totalDoubts, icon: "❓", color: "indigo" },
            secondary: { label: "Resolved", value: resolvedDoubts, icon: "✅", color: "emerald" },
            tertiary: { label: "Total Notes", value: totalNotes, icon: "📚", color: "purple" },
            quaternary: { label: "Announcements", value: announcements, icon: "📢", color: "orange" },
        };
    } else if (role === "faculty") {
        const [assignedDoubts, resolvedByMe, myNotes, totalAnnouncements, pendingDoubts] = await Promise.all([
            Doubt.countDocuments({ assignedTo: userId }),
            Doubt.countDocuments({ answeredBy: userId }),
            Notes.countDocuments({ uploadedBy: userId }),
            Announcement.countDocuments({}),
            Doubt.countDocuments({ assignedTo: userId, status: "pending" }),
        ]);
        stats = {
            primary: { label: "Assigned", value: assignedDoubts, icon: "📥", color: "indigo" },
            secondary: { label: "Resolved", value: resolvedByMe, icon: "✨", color: "emerald" },
            tertiary: { label: "My uploads", value: myNotes, icon: "📤", color: "purple" },
            quaternary: { label: "Announcements", value: totalAnnouncements, icon: "📢", color: "orange" },
            assigned: assignedDoubts,
            pending: pendingDoubts,
            answered: resolvedByMe,
            extra: { pending: pendingDoubts }
        };
    } else if (role === "admin") {
        const [allUsers, allDoubts, allNotes, allAnnouncements] = await Promise.all([
            require("../models/User").countDocuments({}),
            Doubt.countDocuments({}),
            Notes.countDocuments({}),
            Announcement.countDocuments({}),
        ]);
        stats = {
            primary: { label: "Total Users", value: allUsers, icon: "👥", color: "indigo" },
            secondary: { label: "Total Doubts", value: allDoubts, icon: "❓", color: "emerald" },
            tertiary: { label: "Total Notes", value: allNotes, icon: "📚", color: "purple" },
            quaternary: { label: "Total Announcements", value: allAnnouncements, icon: "📢", color: "orange" },
        };
    }

    res.status(200).json({
        success: true,
        data: stats,
    });
});

module.exports = { getDashboardStats };
