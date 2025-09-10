const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên danh mục là bắt buộc"],
      trim: true,
      unique: true,
      maxlength: [120, "Tên danh mục không được vượt quá 120 ký tự"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: { type: String, trim: true, maxlength: 600 },
    image: { type: String, trim: true, default: "" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }, // soft delete
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

// text index cho search cơ bản
categorySchema.index({ name: "text", description: "text" });

// Tạo slug khi tạo/sửa name
categorySchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// Cập nhật slug khi update qua findOneAndUpdate
categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() || {};
  if (update.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
    this.setUpdate(update);
  }
  next();
});

// Virtual: children (để populate cây)
categorySchema.virtual("children", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

module.exports = mongoose.model("Category", categorySchema);
