const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "low",
        },
        targetRole: {
            type: String,
            enum: ["all", "student", "faculty"],
            default: "all",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes for performance
announcementSchema.index({ targetRole: 1, createdAt: -1 });
announcementSchema.index({ priority: 1 });

module.exports = mongoose.model("Announcement", announcementSchema);
