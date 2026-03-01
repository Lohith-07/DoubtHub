const asyncHandler = require("express-async-handler");
const Notification = require("../models/Notification");

// ─────────────────────────────────────────────
// GET ALL NOTIFICATIONS (Current User)
// ─────────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .populate("doubt", "title status")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications,
    });
});

// ─────────────────────────────────────────────
// MARK NOTIFICATION AS READ
// ─────────────────────────────────────────────
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }

    // Ensure user owns the notification
    if (notification.recipient.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized");
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
    });
});

// ─────────────────────────────────────────────
// MARK ALL AS READ
// ─────────────────────────────────────────────
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read",
    });
});

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
