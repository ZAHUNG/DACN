// src/routes/Cart.routes.js
const express = require("express");
const router = express.Router();

const { getMyCart, addItem, updateItem, removeItem, clearCart } =
  require("../controllers/Cart.controller");

const asyncHandler = require("../middlewares/asyncHandler");
const { isAuth } = require("../middlewares/auth");
const loadCart = require("../middlewares/loadCart");
const validateObjectId = require("../middlewares/validateObjectId");

// thứ tự: isAuth -> loadCart -> asyncHandler(controller)
router.get("/",          isAuth, loadCart, asyncHandler(getMyCart));
router.post("/items",    isAuth, loadCart, asyncHandler(addItem));
router.patch(
  "/items/:itemId",
  isAuth,
  loadCart,
  validateObjectId("itemId"),
  asyncHandler(updateItem)
);
router.delete(
  "/items/:itemId",
  isAuth,
  loadCart,
  validateObjectId("itemId"),
  asyncHandler(removeItem)
);
router.post("/clear",    isAuth, loadCart, asyncHandler(clearCart));

module.exports = router;
