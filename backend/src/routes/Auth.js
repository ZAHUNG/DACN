const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Kiểm tra user đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = new User({
      name,
      email,
      passwordHash,
      phone
    });
    
    await user.save();
    
    // Tạo token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Lấy thông tin profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    res.json({ message: 'Cập nhật thành công', user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Thêm địa chỉ
router.post('/addresses', authMiddleware, async (req, res) => {
  try {
    const address = req.body;
    
    const user = await User.findById(req.user.userId);
    
    // Nếu là địa chỉ mặc định, bỏ mặc định của các địa chỉ khác
    if (address.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    user.addresses.push(address);
    await user.save();
    
    res.status(201).json({ message: 'Thêm địa chỉ thành công', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật địa chỉ
router.put('/addresses/:addressIndex', authMiddleware, async (req, res) => {
  try {
    const { addressIndex } = req.params;
    const updateData = req.body;
    
    const user = await User.findById(req.user.userId);
    
    if (!user.addresses[addressIndex]) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    // Nếu set làm mặc định, bỏ mặc định của các địa chỉ khác
    if (updateData.isDefault) {
      user.addresses.forEach(addr => addr.isDefault = false);
    }
    
    Object.assign(user.addresses[addressIndex], updateData);
    await user.save();
    
    res.json({ message: 'Cập nhật địa chỉ thành công', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xóa địa chỉ
router.delete('/addresses/:addressIndex', authMiddleware, async (req, res) => {
  try {
    const { addressIndex } = req.params;
    
    const user = await User.findById(req.user.userId);
    
    if (!user.addresses[addressIndex]) {
      return res.status(404).json({ message: 'Không tìm thấy địa chỉ' });
    }
    
    user.addresses.splice(addressIndex, 1);
    await user.save();
    
    res.json({ message: 'Xóa địa chỉ thành công', addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;