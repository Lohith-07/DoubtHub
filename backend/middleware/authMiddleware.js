const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// 🔹 Protect route (verify token)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// 🔹 Student only
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403);
    throw new Error("Student access only");
  }
};

// 🔹 Faculty only
const isFaculty = (req, res, next) => {
  if (req.user && req.user.role === "faculty") {
    next();
  } else {
    res.status(403);
    throw new Error("Faculty access only");
  }
};

// 🔹 Admin only
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin access only");
  }
};

// 🔹 Faculty or Admin
const isFacultyOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "faculty" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Faculty or Admin required");
  }
};

module.exports = {
  protect,
  isStudent,
  isFaculty,
  isAdmin,
  isFacultyOrAdmin,
};