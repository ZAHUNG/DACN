// routes/User.routes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = express.Router();

// Helper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const sanitizeUser = (userDoc) => {
  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  delete user.passwordHash;
  return user;
};

// ======================= USERS ======================= //

// POST /users
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email và password là bắt buộc" });
    }

    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: "Email đã được sử dụng" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, phone });

    res.status(201).json(sanitizeUser(user));
  })
);

// GET /users
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  })
);

module.exports = router;
