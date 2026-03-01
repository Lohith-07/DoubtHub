const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },
        semester: {
            type: Number,
            required: [true, "Semester is required"],
        },
        department: {
            type: String,
            trim: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        role: {
            type: String,
            enum: ["student", "faculty"],
            required: true,
        },
        files: [
            {
                fileName: String,
                fileId: mongoose.Schema.Types.ObjectId, // GridFS File ID
                contentType: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

// Text index for search
noteSchema.index({ title: "text", subject: "text" });

// Indexes for performance
noteSchema.index({ semester: 1 });
noteSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notes", noteSchema);
