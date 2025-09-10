const express = require("express");
const ctrl = require("../controllers/Category.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const validateObjectId = require("../middlewares/validateObjectId");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Public
router.get("/", asyncHandler(ctrl.listCategories));
router.get("/tree", asyncHandler(ctrl.getCategoryTree));
router.get("/slug/:slug", asyncHandler(ctrl.getCategoryBySlug));
router.get("/:id", validateObjectId("id"), asyncHandler(ctrl.getCategoryById));

// Admin (tạo/sửa/xoá/khôi phục)
router.post("/", isAuth, isAdmin, asyncHandler(ctrl.createCategory));
router.patch("/:id", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.updateCategory));
router.delete("/:id", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.softDeleteCategory));
router.post("/:id/restore", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.restoreCategory));
router.delete("/:id/hard", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.hardDeleteCategory));
router.post("/:id/toggle-active", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.toggleActive));

module.exports = router;
