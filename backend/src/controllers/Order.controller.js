const Order = require("../models/Order.model");

// helper: ép Map/object -> object thường
function toPlainAttr(input) {
  if (!input) return {};
  if (typeof input.get === "function") {
    const out = {};
    for (const [k, v] of input.entries()) out[String(k)] = String(v);
    return out;
  }
  const out = {};
  for (const k of Object.keys(input)) out[String(k)] = String(input[k]);
  return out;
}

// POST /orders  (tạo đơn từ giỏ hiện tại)
// body: { shippingAddress: {...required}, paymentMethod?, shippingFee?, discountTotal?, note? }
exports.createFromCart = async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Chưa đăng nhập" });

  const cart = req.cart; // đã được load bởi middleware loadCart
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng đang trống" });
  }

  const {
    shippingAddress = {},
    paymentMethod = "cod",
    shippingFee = 0,
    discountTotal = 0,
    note,
  } = req.body || {};

  // Validate shippingAddress cơ bản
  for (const f of ["fullName", "phone", "addressLine1"]) {
    if (!shippingAddress[f]) {
      return res.status(400).json({ message: `Thiếu thông tin giao hàng: ${f}` });
    }
  }

  // Chuyển cart items -> order items (snapshot)
  const orderItems = cart.items.map((it) => {
    const qty = it.qty || it.quantity || 0;
    const price = it.priceAtAdd ?? it.price ?? 0;
    const lineTotal = qty * price;
    return {
      productId: it.productId || it.product, // đề phòng schema cũ
      variantId: it.variantId || null,
      name: it.name,
      image: it.image,
      attributes: toPlainAttr(it.attributes),
      qty,
      priceAtAdd: price,
      lineTotal,
      currency: it.currency || "VND",
      compareAtPrice: it.compareAtPrice,
    };
  });

  const itemsTotal = orderItems.reduce((s, it) => s + it.lineTotal, 0);
  const ship = Math.max(0, parseInt(shippingFee, 10) || 0);
  const discount = Math.max(0, parseInt(discountTotal, 10) || 0);
  const grandTotal = Math.max(0, itemsTotal + ship - discount);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    itemsTotal,
    shippingFee: ship,
    discountTotal: discount,
    grandTotal,
    currency: "VND",
    shippingAddress,
    note,
    paymentMethod,
    paymentStatus: "unpaid",
    status: "pending",
  });

  // Clear cart sau khi tạo đơn
  cart.items = [];
  await cart.save();

  // Có thể populate sản phẩm trong item nếu bạn muốn trả về slug/name
  await order.populate({ path: "items.productId", select: "slug name" });

  res.status(201).json(order);
};

// GET /orders/my?page=&limit=&status=
exports.getMyOrders = async (req, res) => {
  const userId = req.user?.id;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);
  const q = { user: userId };
  if (req.query.status) q.status = req.query.status;

  const [items, total] = await Promise.all([
    Order.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "items.productId", select: "slug name" }),
    Order.countDocuments(q),
  ]);

  res.json({ items, pagination: { total, page, limit } });
};

// GET /orders/:orderId  (owner hoặc admin)
exports.getOrderById = async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId).populate({
    path: "items.productId",
    select: "slug name",
  });
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  const isOwner = String(order.user) === String(req.user?.id);
  const isAdmin = req.user?.role === "admin";
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  res.json(order);
};

// ==== ADMIN =====

// GET /orders  (admin) - lọc cơ bản
// query: page, limit, status, paymentStatus, userId
exports.adminList = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 20);
  const q = {};
  if (req.query.status) q.status = req.query.status;
  if (req.query.paymentStatus) q.paymentStatus = req.query.paymentStatus;
  if (req.query.userId) q.user = req.query.userId;

  const [items, total] = await Promise.all([
    Order.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({ path: "items.productId", select: "slug name" }),
    Order.countDocuments(q),
  ]);

  res.json({ items, pagination: { total, page, limit } });
};

// PATCH /orders/:orderId/status  (admin)
exports.adminUpdateStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body || {};
  const allowed = ["pending", "confirmed", "shipping", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  order.status = status;
  await order.save();
  res.json(order);
};

// PATCH /orders/:orderId/pay  (admin)
exports.adminMarkPaid = async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus = "paid" } = req.body || {};
  const allowed = ["unpaid", "paid", "refunded", "failed"];
  if (!allowed.includes(paymentStatus)) {
    return res.status(400).json({ message: "paymentStatus không hợp lệ" });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

  order.paymentStatus = paymentStatus;
  if (paymentStatus === "paid" && !order.paidAt) order.paidAt = new Date();
  await order.save();
  res.json(order);
};
