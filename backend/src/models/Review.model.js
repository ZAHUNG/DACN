const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // optional để xác thực đã mua
  rating: { type: Number, required: true, min: 1, max: 5, index: true },
  comment: { type: String, trim: true },
  images: [{ type: String }],
  isApproved: { type: Boolean, default: true, index: true },
}, { timestamps: true });

reviewSchema.index({ productId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, productId: 1 }, { unique: false }); // cho phép nhiều review/1 user nếu bạn muốn

module.exports = mongoose.model("Review", reviewSchema);
