const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    facultyId,
    department,
    semester,
    courses   // 🔥 ADDED
  } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error("name, email, password, and role are required");
  }

  if (!["student", "faculty"].includes(role)) {
    res.status(400);
    throw new Error("Role must be either 'student' or 'faculty'");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  // Prevent duplicate facultyId registration
  if (role === "faculty" && facultyId) {
    const alreadyRegistered = await User.findOne({
      facultyId: facultyId.trim().toUpperCase(),
    });

    if (alreadyRegistered) {
      res.status(409);
      throw new Error("This Faculty ID is already registered");
    }
  }

  const userData = {
    name,
    email,
    password,
    role,
    department: department || undefined,
  };

  if (role === "faculty") {
    userData.facultyId = facultyId?.trim().toUpperCase();

    // 🔥 ADD THIS BLOCK
    userData.courses = Array.isArray(courses) ? courses : [];
  }

  if (role === "student" && semester !== undefined) {
    userData.semester = semester;
  }

  const user = await User.create(userData);

  const token = generateToken({ id: user._id, role: user.role });

  if (role === "faculty") {
    return res.status(201).json({
      success: true,
      message: "Registration successful. Awaiting admin approval.",
      token: null,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        facultyId: user.facultyId,
        department: user.department,
        courses: user.courses,   // 🔥 RETURN IT
        approved: user.approved,
      },
    });
  }

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      facultyId: user.facultyId,
      semester: user.semester,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.approved) {
  res.status(403);
  throw new Error("Account pending admin approval");
}

  const token = generateToken({ id: user._id, role: user.role });

  
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      facultyId: user.facultyId,
      semester: user.semester,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      facultyId: user.facultyId,
      semester: user.semester,
      createdAt: user.createdAt,
    },
  });
});

module.exports = { register, login, getMe };
