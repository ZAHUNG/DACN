const mongoose = require("mongoose");
const slugify = require("slugify");

const priceSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 }, // giá gốc (nếu muốn hiển thị giảm)
    currency: { type: String, default: "VND", trim: true },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true, required: true },
    alt: { type: String, trim: true, default: "" },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const variantSchema = new mongoose.Schema(
  {
    sku: { type: String, trim: true },
    attributes: {
      // ví dụ: { color: "red", size: "M" }
      type: Map,
      of: String,
      default: {},
    },
    price: { type: Number, min: 0 }, // nếu khác với giá chính
    stock: { type: Number, min: 0, default: 0 },
    barcode: { type: String, trim: true },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200, unique: true },
    slug: { type: String, unique: true, lowercase: true, index: true },

    sku: { type: String, trim: true, index: true, unique: true, sparse: true },
    barcode: { type: String, trim: true },

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    brand: { type: String, trim: true },

    pricing: { type: priceSchema, required: true },
    stock: { type: Number, min: 0, default: 0 }, // tổng tồn (nếu không dùng variant-level)
    sold: { type: Number, min: 0, default: 0 },

    images: { type: [imageSchema], default: [] },
    variants: { type: [variantSchema], default: [] },

    // thuộc tính kỹ thuật tuỳ biến
    attributes: {
      type: Map,
      of: String,
      default: {},
    },

    shortDescription: { type: String, trim: true, maxlength: 600 },
    description: { type: String, trim: true, maxlength: 10000 },

    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }, // soft delete

    // SEO
    metaTitle: { type: String, trim: true, maxlength: 160 },
    metaDescription: { type: String, trim: true, maxlength: 300 },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// Text index cho search
productSchema.index({ name: "text", shortDescription: "text", description: "text", brand: "text" });

// Virtual: finalPrice (ưu tiên variant khi cần tự tính bên ngoài)
productSchema.virtual("finalPrice").get(function () {
  const p = this.pricing?.price || 0;
  return p;
});

// Slug auto khi create/update name
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
    this.setUpdate(update);
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
