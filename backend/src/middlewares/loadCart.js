// src/middlewares/loadCart.js
const Cart = require("../models/Cart.model");

module.exports = async (req, res, next) => {
  try {
    // Yêu cầu đã qua isAuth nên có req.user.id
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Chưa đăng nhập" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    req.cart = cart; // để controller sử dụng
    next();
  } catch (err) {
    next(err);
  }
};
