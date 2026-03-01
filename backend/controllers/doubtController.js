const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Doubt = require("../models/Doubt");
const User = require("../models/User");
const Notification = require("../models/Notification");

// ─────────────────────────────────────────────
// CREATE DOUBT
// ─────────────────────────────────────────────
const createDoubt = asyncHandler(async (req, res) => {
  const { title, description, subject, assignedTo, tags, department } = req.body;

  // 🛡️ SUPER ROBUST VALIDATION
  if (!title || !description || !subject) {
    res.status(400);
    throw new Error("Title, description, and subject are required");
  }

  // 📍 Ensure department is present
  const finalDept = department || req.user.department || "General";

  try {
    const doubtData = {
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      department: finalDept,
      postedBy: req.user._id,
      status: "pending",
      upvotes: [],
      upvoteCount: 0,
      tags: Array.isArray(tags) ? tags : [],
      assignedTo: [], // Initialize as an array
    };

    // Auto-assign faculty based on subject
    const facultyList = await User.find({
      role: "faculty",
      courses: { $in: [subject] },
      approved: true,
    }).select("_id");

    if (facultyList && facultyList.length > 0) {
      doubtData.assignedTo = facultyList.map((f) => f._id);
    }

    // Still allow manual override if provided (optional, but keep for compatibility)
    if (assignedTo) {
      const assignedArray = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
      assignedArray.forEach((id) => {
        if (mongoose.Types.ObjectId.isValid(id) && !doubtData.assignedTo.includes(id)) {
          doubtData.assignedTo.push(id);
        }
      });
    }

    const doubt = await Doubt.create(doubtData);

    // Create notifications for assigned faculty
    if (doubt.assignedTo && doubt.assignedTo.length > 0) {
      const notifications = doubt.assignedTo.map((facultyId) => ({
        recipient: facultyId,
        doubt: doubt._id,
        message: `A new doubt "${title}" has been assigned to you.`,
        type: "assignment",
      }));
      await Notification.insertMany(notifications);

      // Emit real-time notification via Socket.io
      const io = req.app.get("socketio");
      notifications.forEach((n) => {
        io.to(n.recipient.toString()).emit("newNotification", {
          message: n.message,
          doubtId: n.doubt,
        });
      });
    }

    await doubt.populate("postedBy", "name email department semester");
    if (doubt.assignedTo && doubt.assignedTo.length > 0) {
      await doubt.populate("assignedTo", "name email facultyId");
    }

    res.status(201).json({
      success: true,
      message: "Doubt posted successfully",
      data: doubt,
    });
  } catch (error) {
    console.error("Doubt Creation Error Details:", error);
    res.status(500);
    throw new Error(`Doubt Creation Failed: ${error.message}`);
  }
});


// ─────────────────────────────────────────────
// GET ALL DOUBTS (Search + Sort + Pagination + My)
// ─────────────────────────────────────────────
const getAllDoubts = asyncHandler(async (req, res) => {
  const {
    my,
    search,
    sort = "latest",
    page = 1,
    limit = 5,
    assignedTo,
    status,
    tag,        // 🔥 NEW
  } = req.query;

  const pageNumber = Number(page);
  const pageSize = Number(limit);

  let filter = {};

  // My doubts (students only)
  if (my === "true") {
    filter.postedBy = req.user._id;
  }

  // Assigned To filter
  if (assignedTo) {
    filter.assignedTo = { $in: [assignedTo] };
  }

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Tag filter
  if (tag) {
    filter.tags = tag;
  }

  // Search filter
  if (search) {
    const cleanSearch = search.startsWith("#") ? search.substring(1) : search;
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { tags: { $regex: cleanSearch, $options: "i" } },
    ];
  }

  // Sorting logic
  let sortOption = {};
  if (sort === "upvotes") {
    sortOption = { upvoteCount: -1 };
  } else {
    sortOption = { createdAt: -1 };
  }

  const total = await Doubt.countDocuments(filter);

  const doubts = await Doubt.find(filter)
    .populate("postedBy", "name email department semester")
    .populate("answeredBy", "name email department facultyId")
    .populate("assignedTo", "name email department facultyId") // ✅ Added
    .sort(sortOption)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize);

  res.status(200).json({
    success: true,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    count: doubts.length,
    data: doubts,
  });
});

// ─────────────────────────────────────────────
// GET SINGLE DOUBT
// ─────────────────────────────────────────────
const getSingleDoubt = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid doubt ID format");
  }

  const doubt = await Doubt.findById(id)
    .populate("postedBy", "name email department semester")
    .populate("answeredBy", "name email department facultyId")
    .populate("assignedTo", "name email department facultyId")
    .populate("replies.postedBy", "name email role"); // ✅ Added populate for replies

  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  res.status(200).json({
    success: true,
    data: doubt,
  });
});

// ─────────────────────────────────────────────
// ANSWER DOUBT (Faculty Only - Hybrid Logic)
// ─────────────────────────────────────────────
const answerDoubt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid doubt ID format");
  }

  if (!answer || answer.trim() === "") {
    res.status(400);
    throw new Error("Answer text is required");
  }

  const doubt = await Doubt.findById(id);

  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  if (doubt.status === "answered") {
    res.status(409);
    throw new Error("This doubt has already been answered");
  }

  // 🚫 Block if not assigned to this faculty (and doubt is assigned to someone)
  if (
    doubt.assignedTo &&
    doubt.assignedTo.length > 0 &&
    !doubt.assignedTo.some((id) => id.toString() === req.user._id.toString())
  ) {
    res.status(403);
    throw new Error("This doubt is not assigned to you");
  }

  // 🔥 Auto-assign if unassigned (though auto-assignment should handle it)
  if (!doubt.assignedTo || doubt.assignedTo.length === 0) {
    doubt.assignedTo = [req.user._id];
  }

  doubt.answer = answer.trim();
  doubt.answeredBy = req.user._id;
  doubt.status = "answered";

  await doubt.save();

  // Notify student that their doubt has been answered
  const result = await Notification.create({
    recipient: doubt.postedBy,
    doubt: doubt._id,
    message: `Your doubt "${doubt.title}" has been answered by ${req.user.name}.`,
    type: "answer",
  });

  // Emit real-time notification via Socket.io
  const io = req.app.get("socketio");
  io.to(doubt.postedBy.toString()).emit("newNotification", {
    message: result.message,
    doubtId: result.doubt,
  });

  await doubt.populate("postedBy", "name email department semester");
  await doubt.populate("answeredBy", "name email department facultyId");
  await doubt.populate("assignedTo", "name email department facultyId");

  res.status(200).json({
    success: true,
    message: "Doubt answered successfully",
    data: doubt,
  });
});

// ─────────────────────────────────────────────
// TOGGLE UPVOTE
// ─────────────────────────────────────────────
const toggleUpvote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid doubt ID format");
  }

  const doubt = await Doubt.findById(id);

  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  const alreadyUpvoted = doubt.upvotes.some(
    (userId) => userId.toString() === req.user._id.toString()
  );

  if (alreadyUpvoted) {
    doubt.upvotes.pull(req.user._id);
    doubt.upvoteCount -= 1;
  } else {
    doubt.upvotes.push(req.user._id);
    doubt.upvoteCount += 1;
  }

  await doubt.save();

  res.status(200).json({
    success: true,
    upvotesCount: doubt.upvoteCount,
  });
});

// ─────────────────────────────────────────────
// GET TRENDING DOUBTS
// ─────────────────────────────────────────────
const getTrendingDoubts = asyncHandler(async (req, res) => {
  const doubts = await Doubt.find({})
    .populate("postedBy", "name")
    .sort({ upvoteCount: -1, createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: doubts,
  });
});

// ─────────────────────────────────────────────
// ASSIGN DOUBT (Admin Only)
// ─────────────────────────────────────────────
const assignDoubt = asyncHandler(async (req, res) => {
  const { facultyIds } = req.body; // Expecting an array of faculty IDs

  const doubt = await Doubt.findById(req.params.id);

  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  if (!Array.isArray(facultyIds)) {
    res.status(400);
    throw new Error("facultyIds must be an array");
  }

  // Validate all faculty IDs
  const validFaculty = await User.find({
    _id: { $in: facultyIds },
    role: "faculty",
  });

  if (validFaculty.length !== facultyIds.length) {
    res.status(400);
    throw new Error("One or more faculty IDs are invalid");
  }

  doubt.assignedTo = facultyIds;
  await doubt.save();

  // Create notifications for newly assigned faculty
  const notifications = facultyIds.map((facultyId) => ({
    recipient: facultyId,
    doubt: doubt._id,
    message: `A doubt "${doubt.title}" has been manually assigned to you.`,
    type: "assignment",
  }));
  await Notification.insertMany(notifications);

  // Emit real-time notification via Socket.io
  const io = req.app.get("socketio");
  notifications.forEach((n) => {
    io.to(n.recipient.toString()).emit("newNotification", {
      message: n.message,
      doubtId: n.doubt,
    });
  });

  await doubt.populate("assignedTo", "name email department facultyId");

  res.status(200).json({
    success: true,
    message: "Doubt assigned successfully",
    data: doubt,
  });
});

// ─────────────────────────────────────────────
// ADD REPLY (Threaded System)
// ─────────────────────────────────────────────
const addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message, parentReply } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  const doubt = await Doubt.findById(id);
  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  // Check nesting level
  if (parentReply) {
    const parent = doubt.replies.find((r) => r._id.toString() === parentReply);
    if (!parent) {
      res.status(404);
      throw new Error("Parent reply not found");
    }
    if (parent.parentReply) {
      res.status(400);
      throw new Error("Nesting level limited to 2 levels");
    }
  }

  const newReply = {
    message,
    postedBy: req.user._id,
    role: req.user.role,
    parentReply: parentReply || null,
  };

  doubt.replies.push(newReply);
  await doubt.save();

  // Populate the last added reply for the response
  await doubt.populate("replies.postedBy", "name email role");

  // Emit socket event
  const io = req.app.get("socketio");
  io.to(id).emit("newReply", {
    doubtId: id,
    reply: doubt.replies[doubt.replies.length - 1],
  });

  res.status(201).json({
    success: true,
    data: doubt.replies[doubt.replies.length - 1],
  });
});

// ─────────────────────────────────────────────
// DELETE REPLY
// ─────────────────────────────────────────────
const deleteReply = asyncHandler(async (req, res) => {
  const { id, replyId } = req.params;

  const doubt = await Doubt.findById(id);
  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  const reply = doubt.replies.id(replyId);
  if (!reply) {
    res.status(404);
    throw new Error("Reply not found");
  }

  // Only owner or admin can delete
  if (reply.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this reply");
  }

  // If deleting a top-level reply, should we delete its children?
  // Requirements say limit nesting to 2 levels.
  // We'll pull the specific reply.
  doubt.replies.pull(replyId);

  // Also remove replies that had this as parent
  doubt.replies = doubt.replies.filter(r => r.parentReply?.toString() !== replyId);

  await doubt.save();

  res.status(200).json({
    success: true,
    message: "Reply removed",
  });
});

// ─────────────────────────────────────────────
// UPDATE DOUBT (Owner Only)
// ─────────────────────────────────────────────
const updateDoubt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, subject, tags } = req.body;

  const doubt = await Doubt.findById(id);

  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  // Only owner can edit
  if (doubt.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the owner can edit this doubt");
  }

  doubt.title = title || doubt.title;
  doubt.description = description || doubt.description;
  doubt.subject = subject || doubt.subject;
  if (tags) doubt.tags = tags;

  await doubt.save();

  await doubt.populate("postedBy", "name email department semester");
  await doubt.populate("answeredBy", "name email department facultyId");
  await doubt.populate("assignedTo", "name email department facultyId");
  await doubt.populate("replies.postedBy", "name email role");

  res.status(200).json({
    success: true,
    message: "Doubt updated successfully",
    data: doubt,
  });
});

// ─────────────────────────────────────────────
// DELETE DOUBT (Owner or Admin)
// ─────────────────────────────────────────────
const deleteDoubt = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doubt = await Doubt.findById(id);

  if (!doubt) {
    res.status(404);
    throw new Error("Doubt not found");
  }

  // Only owner or admin can delete
  if (doubt.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this doubt");
  }

  await doubt.deleteOne();

  res.status(200).json({
    success: true,
    message: "Doubt deleted successfully",
  });
});

module.exports = {
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
};