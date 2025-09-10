const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/Order.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const { isAuth, isAdmin } = require("../middlewares/auth");
const loadCart = require("../middlewares/loadCart");
const validateObjectId = require("../middlewares/validateObjectId");

// Tạo đơn từ giỏ -> cần isAuth + loadCart
router.post("/", isAuth, loadCart, asyncHandler(ctrl.createFromCart));

// Lấy đơn của chính mình
router.get("/my", isAuth, asyncHandler(ctrl.getMyOrders));

// Xem chi tiết đơn (owner hoặc admin)
router.get(
  "/:orderId",
  isAuth,
  validateObjectId("orderId"),
  asyncHandler(ctrl.getOrderById)
);

// ===== Admin =====
router.get("/", isAuth, isAdmin, asyncHandler(ctrl.adminList));
router.patch(
  "/:orderId/status",
  isAuth,
  isAdmin,
  validateObjectId("orderId"),
  asyncHandler(ctrl.adminUpdateStatus)
);
router.patch(
  "/:orderId/pay",
  isAuth,
  isAdmin,
  validateObjectId("orderId"),
  asyncHandler(ctrl.adminMarkPaid)
);

module.exports = router;
