console.log("Server Is loaded");

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const doubtRoutes = require("./routes/doubtRoutes");
const adminRoutes = require("./routes/adminRoutes");

dotenv.config();

// Create app FIRST
const app = express();

// Enable CORS
app.use(cors({
  origin: "*",
  credentials: true
}));

// Initialize HTTP server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust as necessary for security
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Store io instance on app for use in controllers
app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their notification room.`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected.");
  });
});

// Connect to MongoDB
connectDB();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --------------------
// ROUTES
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/doubts", doubtRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notes", require("./routes/notesRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/search", require("./routes/searchRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));

// Serve static folder for uploads
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// --------------------
// HEALTH CHECK ROUTE
// --------------------
app.get("/", (req, res) => {
  res.json({ message: "Central Doubt Desk API is running" });
});

// --------------------
// 404 HANDLER
// --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

// --------------------
// GLOBAL ERROR HANDLER
// --------------------
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// --------------------
// START SERVER
// --------------------

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});