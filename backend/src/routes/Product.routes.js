const express = require('express');
const Product = require('../models/Product.model');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Lấy danh sách sản phẩm (có phân trang, lọc, tìm kiếm)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      brand,
      minPrice,
      maxPrice,
      sort = '-createdAt'
    } = req.query;

    let query = { isActive: true };

    // Tìm kiếm theo text
    if (search) {
      query.$text = { $search: search };
    }

    // Lọc theo category
    if (categoryId) {
      query.categoryIds = categoryId;
    }

    // Lọc theo brand
    if (brand) {
      query.brand = new RegExp(brand, 'i');
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('categoryIds', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy chi tiết sản phẩm theo slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    }).populate('categoryIds', 'name slug path');

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy sản phẩm liên quan
router.get('/:slug/related', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      $or: [
        { categoryIds: { $in: product.categoryIds } },
        { brand: product.brand }
      ],
      isActive: true
    })
    .limit(8)
    .select('name slug price salePrice images brand');

    res.json(relatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// === ADMIN ROUTES ===

// Tạo sản phẩm mới (Admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const productData = req.body;
    
    // Tạo slug từ name nếu không có
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({ message: 'Tạo sản phẩm thành công', product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug đã tồn tại' });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy tất cả sản phẩm cho admin
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      isActive
    } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('categoryIds', 'name')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật sản phẩm (Admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Cập nhật sản phẩm thành công', product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa sản phẩm (Admin) - Soft delete
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật stock sản phẩm (Admin)
router.patch('/:id/stock', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { stock } = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({ message: 'Cập nhật tồn kho thành công', product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;