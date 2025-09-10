const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

// Tạo product
exports.createProduct = async (req, res) => {
  const {
    name,
    categorySlug,  // FE gửi slug
    pricing,
    sku,
    barcode,
    brand,
    stock,
    images,
    variants,
    attributes,
    shortDescription,
    description,
    isActive,
    metaTitle,
    metaDescription,
  } = req.body || {};

  // Validate cơ bản
  if (!name) return res.status(400).json({ message: "Tên sản phẩm là bắt buộc" });
  if (!categorySlug) return res.status(400).json({ message: "Slug category là bắt buộc" });
  if (!pricing?.price) return res.status(400).json({ message: "Giá sản phẩm là bắt buộc" });

  // Kiểm tra tên sản phẩm trùng
  const existedName = await Product.findOne({ name });
  if (existedName) return res.status(409).json({ message: "Tên sản phẩm đã tồn tại" });

  // Kiểm tra SKU trùng
  if (sku) {
    const existedSku = await Product.findOne({ sku });
    if (existedSku) return res.status(409).json({ message: "SKU đã tồn tại" });
  }

  // Tìm category theo slug thay vì _id
  const categoryDoc = await Category.findOne({ slug: categorySlug, isDeleted: false });
  if (!categoryDoc) return res.status(400).json({ message: "Category không tồn tại hoặc đã bị xoá" });

  // Tạo sản phẩm
  const product = await Product.create({
    name,
    category: categoryDoc._id, // Backend tự gắn ID
    pricing,
    sku,
    barcode,
    brand,
    stock,
    images,
    variants,
    attributes,
    shortDescription,
    description,
    isActive: isActive !== undefined ? !!isActive : true,
    metaTitle,
    metaDescription,
  });

  // Populate category
  const populated = await Product.findById(product._id).populate("category", "name slug");
  res.status(201).json(populated);
};


// Danh sách + phân trang + lọc + sắp xếp + search
exports.listProducts = async (req, res) => {
  const page = Math.max(parseInt(req.query.page || "1", 10), 1);
  const limit = Math.min(parseInt(req.query.limit || "20", 10), 100);

  const search = (req.query.search || "").trim();
  const category = req.query.category || undefined;
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined;
  const activeOnly = req.query.activeOnly !== "false"; // mặc định true
  const includeDeleted = req.query.includeDeleted === "true";

  // sort: price_asc|price_desc|newest|oldest|sold_desc
  const sortParam = (req.query.sort || "newest").toLowerCase();
  const sortMap = {
    price_asc: { "pricing.price": 1 },
    price_desc: { "pricing.price": -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    sold_desc: { sold: -1 },
  };
  const sort = sortMap[sortParam] || sortMap.newest;

  const filter = {};
  if (activeOnly) filter.isActive = true;
  if (!includeDeleted) filter.isDeleted = false;
  if (category) filter.category = category;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter["pricing.price"] = {};
    if (minPrice !== undefined) filter["pricing.price"].$gte = minPrice;
    if (maxPrice !== undefined) filter["pricing.price"].$lte = maxPrice;
  }
  if (search) {
    filter.$text = { $search: search };
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// Lấy theo ID
exports.getProductById = async (req, res) => {
  const doc = await Product.findById(req.params.id).populate("category", "name slug");
  if (!doc || doc.isDeleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(doc);
};

// Lấy theo slug
exports.getProductBySlug = async (req, res) => {
  const doc = await Product.findOne({ slug: req.params.slug, isDeleted: false }).populate(
    "category",
    "name slug"
  );
  if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(doc);
};

// Cập nhật
exports.updateProduct = async (req, res) => {
  const {
    name,
    category,
    pricing,
    sku,
    barcode,
    brand,
    stock,
    images,
    variants,
    attributes,
    shortDescription,
    description,
    isActive,
    metaTitle,
    metaDescription,
  } = req.body || {};

  if (category) {
    const cat = await Category.findById(category);
    if (!cat || cat.isDeleted) return res.status(400).json({ message: "Category không hợp lệ" });
  }

  if (sku) {
    const existedSku = await Product.findOne({ sku, _id: { $ne: req.params.id } });
    if (existedSku) return res.status(409).json({ message: "SKU đã tồn tại" });
  }

  const updated = await Product.findOneAndUpdate(
    { _id: req.params.id },
    {
      name,
      category,
      pricing,
      sku,
      barcode,
      brand,
      stock,
      images,
      variants,
      attributes,
      shortDescription,
      description,
      isActive,
      metaTitle,
      metaDescription,
    },
    { new: true, runValidators: true }
  ).populate("category", "name slug");

  if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json(updated);
};

// Soft delete
exports.softDeleteProduct = async (req, res) => {
  const updated = await Product.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { isDeleted: true, isActive: false },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm hoặc đã xoá" });
  res.json({ message: "Đã xoá (mềm)", item: updated });
};

// Khôi phục
exports.restoreProduct = async (req, res) => {
  const updated = await Product.findOneAndUpdate(
    { _id: req.params.id, isDeleted: true },
    { isDeleted: false, isActive: true },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm đã xoá" });
  res.json({ message: "Đã khôi phục", item: updated });
};

// Xoá hẳn
exports.hardDeleteProduct = async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  res.json({ message: "Đã xoá vĩnh viễn" });
};

// Toggle active
exports.toggleActive = async (req, res) => {
  const doc = await Product.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
  doc.isActive = !doc.isActive;
  await doc.save();
  res.json(doc);
};

// Điều chỉnh tồn kho (tăng/giảm)
exports.adjustInventory = async (req, res) => {
  const { delta = 0, variantId } = req.body || {};
  const doc = await Product.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

  const change = Number(delta) || 0;

  if (variantId) {
    const v = doc.variants.id(variantId);
    if (!v) return res.status(404).json({ message: "Không tìm thấy biến thể" });
    v.stock = Math.max(0, (v.stock || 0) + change);
  } else {
    doc.stock = Math.max(0, (doc.stock || 0) + change);
  }

  await doc.save();
  res.json(doc);
};
