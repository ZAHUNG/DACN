const mongoose = require("mongoose");
const { Schema } = mongoose;

// Lưu ý: nên dùng số nguyên "minor units" cho tiền tệ (VND)
const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variantId: { type: Schema.Types.ObjectId, default: null },
    name: String,
    image: String,
    attributes: { type: Map, of: String, default: {} },
    qty: { type: Number, required: true, min: 1 },
    priceAtAdd: { type: Number, required: true, min: 0 }, // đơn giá tại thời điểm đặt
    lineTotal: { type: Number, required: true, min: 0 },  // qty * priceAtAdd
    currency: { type: String, default: "VND" },
    compareAtPrice: { type: Number },
  },
  { _id: false }
);

const shippingAddressSchema = new Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    ward: String,
    district: String,
    province: String,
    country: { type: String, default: "VN" },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      index: true,
      default: () =>
        "ODR-" +
        Math.random().toString(36).slice(2, 6).toUpperCase() +
        "-" +
        Date.now().toString(36).toUpperCase(),
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Đơn hàng phải có ít nhất 1 sản phẩm",
      },
      required: true,
    },

    itemsTotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discountTotal: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "VND" },

    shippingAddress: { type: shippingAddressSchema, required: true },
    note: String,

    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay", "momo", "stripe", "paypal"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "completed", "cancelled"],
      default: "pending",
    },
    paidAt: { type: Date },

    meta: { type: Map, of: String },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
