// routes/index.js
const express = require("express");
const userRoutes = require("./User.routes");
const categoryRoutes = require("./Category.routes");
const productRoutes = require("./Product.routes");
const router = express.Router();

// Mount các router con
router.use("/users", userRoutes); 
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/cart", require("./Cart.routes"));
router.use("/orders", require("./Order.routes"));

// Route test API
router.get("/", (req, res) => {
  res.json({ message: "API is working 🚀" });
});

module.exports = router;
