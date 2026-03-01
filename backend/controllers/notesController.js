const asyncHandler = require("express-async-handler");
const Notes = require("../models/Notes");
const mongoose = require("mongoose");
const { getGridFsBucket } = require("../middleware/gridFsMiddleware");

// @desc    Upload new notes
// @route   POST /api/notes
// @access  Private (Student or Faculty)
const uploadNotes = asyncHandler(async (req, res) => {
  const { title, subject, semester, department } = req.body;

  if (!title || !subject || !semester) {
    res.status(400);
    throw new Error("Title, subject, and semester are required");
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("Please upload at least one file");
  }

  const bucket = getGridFsBucket();

  if (!bucket) {
    res.status(500);
    throw new Error("GridFS Bucket not initialized");
  }

  const noteFiles = [];

  for (const file of req.files) {
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    noteFiles.push({
      fileName: file.originalname,
      fileId: uploadStream.id,
      contentType: file.mimetype,
      uploadedAt: new Date(),
    });
  }

  const notes = await Notes.create({
    title,
    subject,
    semester,
    department: department || req.user.department,
    uploadedBy: req.user._id,
    role: req.user.role,
    files: noteFiles,
  });

  res.status(201).json({
    success: true,
    data: notes,
  });
});

// @desc    Get all notes (with search and filters)
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
    const { search, semester, page = 1, limit = 9 } = req.query;
    let query = {};

    if (semester) {
        query.semester = semester;
    }

    if (search) {
        query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const total = await Notes.countDocuments(query);
    const notes = await Notes.find(query)
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

    res.status(200).json({
        success: true,
        count: notes.length,
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: notes,
    });
});

// @desc    Stream a file from GridFS
// @route   GET /api/notes/file/:fileId
// @access  Private
const streamFile = asyncHandler(async (req, res) => {
    const bucket = getGridFsBucket();
    if (!bucket) {
        res.status(500);
        throw new Error("GridFS Bucket not initialized");
    }

    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Check if file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
        res.status(404);
        throw new Error("File not found");
    }

    const file = files[0];
    res.set("Content-Type", file.contentType);
    // Optional: Content-Disposition to force download or set filename
    // res.set("Content-Disposition", `inline; filename="${file.filename}"`);

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res);

    downloadStream.on("error", (err) => {
        res.status(404).json({ message: "Error streaming file" });
    });
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private (Owner or Admin)
const deleteNotes = asyncHandler(async (req, res) => {
    const notes = await Notes.findById(req.params.id);

    if (!notes) {
        res.status(404);
        throw new Error("Notes not found");
    }

    // Check ownership or admin
    if (notes.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        res.status(403);
        throw new Error("Not authorized to delete this note");
    }

    // Delete files from GridFS
    const bucket = getGridFsBucket();
    if (bucket) {
        for (const file of notes.files) {
            try {
                await bucket.delete(file.fileId);
            } catch (err) {
                console.error(`Error deleting file ${file.fileId}:`, err.message);
            }
        }
    }

    await notes.deleteOne();

    res.status(200).json({
        success: true,
        message: "Notes deleted successfully",
    });
});

module.exports = {
    uploadNotes,
    getNotes,
    streamFile,
    deleteNotes,
};
