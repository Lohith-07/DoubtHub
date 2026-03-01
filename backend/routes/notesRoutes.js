const express = require("express");
const router = express.Router();
const { uploadNotes, getNotes, deleteNotes, streamFile } = require("../controllers/notesController");
const { protect, isAdmin } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/gridFsMiddleware");

router.use((req, res, next) => {
    console.log(`Notes Router Hit: ${req.method} ${req.url}`);
    next();
});

router.get("/file/:fileId", streamFile);
router.post("/", protect, upload.array("files", 5), uploadNotes);
router.get("/", protect, getNotes);
router.delete("/:id", protect, deleteNotes);

module.exports = router;
