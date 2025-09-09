const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  qty: { type: Number, required: true, min: 1 },
  // Ghim giá tại thời điểm thêm (tránh sốc giá lúc checkout)
  priceAtAdd: { type: Number, required: true, min: 0 },
  salePriceAtAdd: { type: Number, min: 0 },
}, { _id: false });

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  sessionId: { type: String, index: true }, // cho guest
  items: [cartItemSchema],
  couponCode: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

cartSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model("Cart", cartSchema);
