const express = require("express");
const ctrl = require("../controllers/Product.controller");
const asyncHandler = require("../middlewares/asyncHandler");
const validateObjectId = require("../middlewares/validateObjectId");
const { isAuth, isAdmin } = require("../middlewares/auth");

const router = express.Router();

// Public
router.get("/", asyncHandler(ctrl.listProducts));
router.get("/slug/:slug", asyncHandler(ctrl.getProductBySlug));
router.get("/:id", validateObjectId("id"), asyncHandler(ctrl.getProductById));

// Admin
router.post("/", isAuth, isAdmin, asyncHandler(ctrl.createProduct));
router.patch("/:id", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.updateProduct));

router.delete("/:id", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.softDeleteProduct));
router.post("/:id/restore", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.restoreProduct));
router.delete("/:id/hard", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.hardDeleteProduct));

router.post("/:id/toggle-active", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.toggleActive));
router.post("/:id/adjust-inventory", isAuth, isAdmin, validateObjectId("id"), asyncHandler(ctrl.adjustInventory));

module.exports = router;
