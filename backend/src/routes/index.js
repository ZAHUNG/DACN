// routes/index.js
const express = require("express");
const userRoutes = require("./User.routes");

const router = express.Router();

// Mount các router con
router.use("/users", userRoutes); // Tất cả routes liên quan user sẽ bắt đầu với /users

// Route test API
router.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

module.exports = router;
