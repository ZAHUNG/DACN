const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", index: true },
  name: { type: String, required: true, trim: true },    // snapshot
  image: { type: String },                                // snapshot
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },       // snapshot (giá áp dụng)
  salePrice: { type: Number, min: 0 },                    // snapshot
}, { _id: false });

const addressSnapshotSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  line1: String,
  line2: String,
  ward: String,
  district: String,
  province: String,
  country: { type: String, default: "VN" },
  postalCode: String,
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  method: { type: String, trim: true },
  carrier: { type: String, trim: true },
  trackingNumber: { type: String, trim: true, index: true },
  status: { type: String, enum: ["created", "in_transit", "out_for_delivery", "delivered", "failed"], default: "created" },
  history: [{
    status: String,
    note: String,
    at: { type: Date, default: Date.now }
  }]
}, { _id: false });

const paymentSchema = new mongoose.Schema({
  method: { type: String, trim: true }, // vnpay|momo|cod|stripe|paypal...
  provider: { type: String, trim: true },
  status: { type: String, enum: ["init", "authorized", "captured", "failed", "refunded"], default: "init", index: true },
  txnId: { type: String, trim: true, index: true },
  paidAt: { type: Date },
  rawResponse: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const amountsSchema = new mongoose.Schema({
  itemSubtotal: { type: Number, required: true, min: 0 },
  shippingFee: { type: Number, default: 0, min: 0 },
  discount: { type: Number, default: 0, min: 0 },
  tax: { type: Number, default: 0, min: 0 },
  grandTotal: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "VND" },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true }, // mã đơn
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  status: { 
    type: String,
    enum: ["pending", "paid", "picking", "shipped", "delivered", "cancelled", "refunded"],
    default: "pending",
    index: true
  },
  items: { type: [orderItemSchema], default: [], validate: v => Array.isArray(v) && v.length > 0 },
  amounts: amountsSchema,
  shippingAddress: addressSnapshotSchema,
  billingAddress: addressSnapshotSchema,
  shipping: shippingSchema,
  payment: paymentSchema,
  couponCode: { type: String, trim: true },
  notes: { type: String, trim: true },
}, { timestamps: true });

orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
