const mongoose = require("mongoose");
const multer = require("multer");

let gridfsBucket;

// Initialize GridFS after MongoDB connects
mongoose.connection.once("open", () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    { bucketName: "uploads" }
  );
  console.log("GridFS Bucket initialized");
});

// Use memory storage (NOT disk, NOT gridfs-storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const getGridFsBucket = () => gridfsBucket;

module.exports = { upload, getGridFsBucket };