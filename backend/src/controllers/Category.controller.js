const Category = require("../models/Category.model");

// Tạo danh mục
exports.createCategory = async (req, res) => {
  const { name, description, image, parent, isActive } = req.body || {};
  if (!name) return res.status(400).json({ message: "Tên danh mục là bắt buộc" });

  const existed = await Category.findOne({ name });
  if (existed) return res.status(409).json({ message: "Tên danh mục đã tồn tại" });

  // kiểm tra parent nếu có
  let parentDoc = null;
  if (parent) {
    parentDoc = await Category.findById(parent);
    if (!parentDoc) return res.status(400).json({ message: "Parent không tồn tại" });
  }

  const cat = await Category.create({
    name,
    description,
    image,
    parent: parent || null,
    isActive: isActive !== undefined ? !!isActive : true,
  });
  res.status(201).json(cat);
};

// Danh sách + phân trang + search + filter
exports.listCategories = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);
  const search = (req.query.search || "").trim();
  const includeDeleted = req.query.includeDeleted === "true";
  const parent = req.query.parent || undefined; // null -> gốc; id -> con

  const filter = {};
  if (!includeDeleted) filter.isDeleted = false;
  if (parent === "null") filter.parent = null;
  else if (parent) filter.parent = parent;

  if (search) {
    filter.$text = { $search: search };
  }

  const [items, total] = await Promise.all([
    Category.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Category.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// Lấy theo ID
exports.getCategoryById = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat || cat.isDeleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
  res.json(cat);
};

// Lấy theo slug (phổ biến cho SEO)
exports.getCategoryBySlug = async (req, res) => {
  const cat = await Category.findOne({ slug: req.params.slug, isDeleted: false });
  if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });
  res.json(cat);
};

// Cập nhật
exports.updateCategory = async (req, res) => {
  const { name, description, image, parent, isActive } = req.body || {};

  // kiểm tra parent nếu có
  if (parent) {
    const parentDoc = await Category.findById(parent);
    if (!parentDoc) return res.status(400).json({ message: "Parent không tồn tại" });
    if (parent === req.params.id) {
      return res.status(400).json({ message: "Parent không được trùng chính nó" });
    }
  }

  const updated = await Category.findOneAndUpdate(
    { _id: req.params.id },
    { name, description, image, parent: parent ?? undefined, isActive },
    { new: true, runValidators: true }
  );

  if (!updated) return res.status(404).json({ message: "Không tìm thấy danh mục" });
  res.json(updated);
};

// Soft delete
exports.softDeleteCategory = async (req, res) => {
  const updated = await Category.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Không tìm thấy danh mục hoặc đã xoá" });
  res.json({ message: "Đã xoá (mềm)", item: updated });
};

// Khôi phục
exports.restoreCategory = async (req, res) => {
  const updated = await Category.findOneAndUpdate(
    { _id: req.params.id, isDeleted: true },
    { isDeleted: false, isActive: true },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Không tìm thấy danh mục đã xoá" });
  res.json({ message: "Đã khôi phục", item: updated });
};

// Xoá hẳn (cẩn trọng)
exports.hardDeleteCategory = async (req, res) => {
  const deleted = await Category.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
  res.json({ message: "Đã xoá vĩnh viễn" });
};

// Toggle active
exports.toggleActive = async (req, res) => {
  const cat = await Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: "Không tìm thấy danh mục" });
  cat.isActive = !cat.isActive;
  await cat.save();
  res.json(cat);
};

// Lấy cây danh mục (1 cấp con)
exports.getCategoryTree = async (req, res) => {
  const roots = await Category.find({ parent: null, isDeleted: false }).populate({
    path: "children",
    match: { isDeleted: false },
  });
  res.json(roots);
};
