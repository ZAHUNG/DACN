const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, required: true },
  phone: {
    type: String, trim: true,
    match: [/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ"]
  },
  line1: { type: String, trim: true, required: true },
  line2: { type: String, trim: true },
  ward: { type: String, trim: true, required: true },
  district: { type: String, trim: true, required: true },
  province: { type: String, trim: true, required: true },
  country: { type: String, trim: true, default: "VN" },
  postalCode: { type: String, trim: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,         // GIỮ unique
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
  },
  passwordHash: { type: String, required: true, select: false },
  phone: {
    type: String, trim: true,
    match: [/^(0|\+84)\d{9,10}$/, "Số điện thoại không hợp lệ"],
  },
  addresses: { type: [addressSchema], default: [] },
  role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },

  status: { type: String, enum: ["active", "banned"], default: "active" },
  emailVerified: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
}, {
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.passwordHash;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// ❌ BỎ dòng index thủ công bị trùng:
// userSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

userSchema.pre("save", function (next) {
  if (!this.isModified("addresses")) return next();
  const defaults = (this.addresses || []).filter(a => a.isDefault);
  if (defaults.length > 1) {
    return next(new Error("Chỉ được có một địa chỉ mặc định"));
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
