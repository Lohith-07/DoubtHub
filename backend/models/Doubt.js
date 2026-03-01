const mongoose = require("mongoose");

const doubtSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answer: {
      type: String,
      trim: true,
      default: null,
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "answered"],
      default: "pending",
    },

    // 🔥 NEW FIELD — Users who upvoted
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🔥 NEW FIELD — Optimized count for sorting
    upvoteCount: {
      type: Number,
      default: 0,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    replies: [
      {
        message: { type: String, required: true },
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, required: true },
        parentReply: { type: mongoose.Schema.Types.ObjectId, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// 🔥 Optional performance index for sorting & search
doubtSchema.index({ upvoteCount: -1 });
doubtSchema.index({ createdAt: -1 });
doubtSchema.index({ title: "text", subject: "text" });

module.exports = mongoose.model("Doubt", doubtSchema);