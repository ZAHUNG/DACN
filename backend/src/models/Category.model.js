const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  path: { type: String, trim: true, index: true }, // ví dụ: /men/shoes
  position: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
