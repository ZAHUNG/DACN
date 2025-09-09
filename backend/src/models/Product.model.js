const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String, trim: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String },
  brand: { type: String, trim: true },
  categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true }],
  images: [imageSchema],

  // Giá bán trực tiếp
  price: { type: Number, required: true, min: 0 },
  salePrice: { type: Number, min: 0 },
  currency: { type: String, default: "VND" },

  // Tồn kho
  stock: { type: Number, default: 0, min: 0 },

  // Thuộc tính tùy ý (không phải biến thể SKU)
  attributes: { type: Map, of: String }, // ví dụ: material=leather, color=red
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width:  { type: Number, min: 0 },
    height: { type: Number, min: 0 },
  },

  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

productSchema.index({ name: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
