const express = require('express');
const Category = require('../models/Category.model');
const Product = require('../models/Product.model');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Lấy tất cả categories (dạng tree)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ position: 1, createdAt: 1 });

    // Tạo tree structure
    const categoryMap = {};
    const rootCategories = [];

    // Tạo map
    categories.forEach(cat => {
      categoryMap[cat._id] = {
        ...cat.toObject(),
        children: []
      };
    });

    // Xây dựng tree
    categories.forEach(cat => {
      if (cat.parentId) {
        if (categoryMap[cat.parentId]) {
          categoryMap[cat.parentId].children.push(categoryMap[cat._id]);
        }
      } else {
        rootCategories.push(categoryMap[cat._id]);
      }
    });

    res.json(rootCategories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy categories dạng flat list
router.get('/flat', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .populate('parentId', 'name slug')
      .sort({ position: 1, createdAt: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy chi tiết category và sản phẩm
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    // Lấy tất cả category con
    const allSubCategories = await Category.find({
      path: new RegExp(`^${category.path}`),
      isActive: true
    });

    const categoryIds = [category._id, ...allSubCategories.map(cat => cat._id)];

    // Pagination cho sản phẩm
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({
      categoryIds: { $in: categoryIds },
      isActive: true
    })
    .sort(sort)
    .skip(skip)
    .limit(Number(limit))
    .select('name slug price salePrice images brand stock');

    const totalProducts = await Product.countDocuments({
      categoryIds: { $in: categoryIds },
      isActive: true
    });

    res.json({
      category,
      products,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / limit),
        totalItems: totalProducts
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy subcategories của một category
router.get('/:slug/children', async (req, res) => {
  try {
    const parentCategory = await Category.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!parentCategory) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    const children = await Category.find({
      parentId: parentCategory._id,
      isActive: true
    }).sort({ position: 1 });

    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// === ADMIN ROUTES ===

// Tạo category mới (Admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, parentId, position } = req.body;
    
    // Tạo slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Tạo path
    let path = `/${slug}`;
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(400).json({ message: 'Danh mục cha không tồn tại' });
      }
      path = `${parent.path}/${slug}`;
    }

    const category = new Category({
      name,
      slug,
      parentId: parentId || null,
      path,
      position: position || 0
    });

    await category.save();

    res.status(201).json({ message: 'Tạo danh mục thành công', category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug đã tồn tại' });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy tất cả categories cho admin
router.get('/admin/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('parentId', 'name')
      .sort({ position: 1, createdAt: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật category (Admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, parentId, position, isActive } = req.body;
    const categoryId = req.params.id;

    // Không cho phép set parent là chính nó hoặc con của nó
    if (parentId && parentId === categoryId) {
      return res.status(400).json({ message: 'Không thể set parent là chính nó' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    // Cập nhật slug nếu name thay đổi
    let slug = category.slug;
    if (name !== category.name) {
      slug = name.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Tính lại path
    let path = `/${slug}`;
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(400).json({ message: 'Danh mục cha không tồn tại' });
      }
      path = `${parent.path}/${slug}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name, slug, parentId: parentId || null, path, position, isActive },
      { new: true, runValidators: true }
    );

    res.json({ message: 'Cập nhật danh mục thành công', category: updatedCategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug đã tồn tại' });
    }
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa category (Admin) - Soft delete
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categoryId = req.params.id;
    
    // Kiểm tra xem có subcategories không
    const hasChildren = await Category.exists({ parentId: categoryId });
    if (hasChildren) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục có danh mục con' 
      });
    }

    // Kiểm tra xem có sản phẩm không
    const hasProducts = await Product.exists({ categoryIds: categoryId });
    if (hasProducts) {
      return res.status(400).json({ 
        message: 'Không thể xóa danh mục có sản phẩm' 
      });
    }

    await Category.findByIdAndUpdate(categoryId, { isActive: false });

    res.json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;