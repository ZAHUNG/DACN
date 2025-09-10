const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");

// GET /cart
exports.getMyCart = async (req, res) => {
  // đổi path populate về productId
  await req.cart.populate({ path: "items.productId", select: "slug name" });
  res.json(req.cart);
};

// POST /cart/items
exports.addItem = async (req, res) => {
  const { productId, productSlug, quantity = 1, variantId, attributes } = req.body || {};
  if (!productId && !productSlug) {
    return res.status(400).json({ message: "Cần productId hoặc productSlug" });
  }
  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const product = productId
    ? await Product.findById(productId)
    : await Product.findOne({ slug: productSlug, isDeleted: false });

  if (!product || product.isDeleted || !product.isActive) {
    return res.status(404).json({ message: "Sản phẩm không tồn tại hoặc không hoạt động" });
  }

  // snapshot giá & ảnh
  const basePrice = product.pricing?.price || 0;
  let finalPrice = basePrice;

  // nếu có variant
  let attrs = {};
  if (variantId) {
    const v = product.variants?.id?.(variantId) ||
              (product.variants || []).find((vv) => String(vv._id) === String(variantId));
    if (!v) return res.status(404).json({ message: "Không tìm thấy biến thể" });
    if (typeof v.price === "number") finalPrice = v.price;

    // Map hoặc object → ép về object thường
    const raw = v.attributes || {};
    attrs = raw instanceof Map ? Object.fromEntries(raw) : { ...raw };
  }
  // override attributes nếu FE gửi
  if (attributes && typeof attributes === "object") {
    for (const k of Object.keys(attributes)) attrs[k] = String(attributes[k]);
  }

  const primaryImg = (product.images || []).find((i) => i.isPrimary) || product.images?.[0] || {};
  const snapshot = {
    // !!! đổi tên field cho khớp schema
    productId: product._id,
    variantId: variantId || null,
    name: product.name,                 // nếu schema bạn không có 'name', có thể bỏ
    image: primaryImg.url || "",
    priceAtAdd: finalPrice,             // !!! required theo schema
    compareAtPrice: product.pricing?.compareAtPrice || undefined,
    currency: product.pricing?.currency || "VND",
    qty,                                // !!! required theo schema
    attributes: attrs,
  };

  // gộp dòng theo productId + variantId + attributes
  const sameLineIndex = req.cart.items.findIndex((it) => {
    const sameProd = String(it.productId) === String(snapshot.productId);
    const sameVar = String(it.variantId || "") === String(snapshot.variantId || "");

    const a = it.attributes instanceof Map ? Object.fromEntries(it.attributes) : (it.attributes || {});
    const b = attrs || {};
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (!(sameProd && sameVar && keysA.length === keysB.length)) return false;
    return keysA.every((k) => String(a[k]) === String(b[k]));
  });

  if (sameLineIndex >= 0) {
    req.cart.items[sameLineIndex].qty += qty;     // !!! dùng qty
  } else {
    req.cart.items.push(snapshot);
  }

  await req.cart.save();
  await req.cart.populate({ path: "items.productId", select: "slug name" }); // !!! productId
  res.status(201).json(req.cart);
};

// PATCH /cart/items/:itemId
exports.updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body || {};
  if (!itemId) return res.status(400).json({ message: "Thiếu itemId" });

  const idx = req.cart.items.findIndex((it) => String(it._id) === String(itemId));
  if (idx < 0) return res.status(404).json({ message: "Không tìm thấy item trong giỏ" });

  const q = parseInt(quantity, 10);
  if (isNaN(q)) return res.status(400).json({ message: "Quantity không hợp lệ" });

  if (q <= 0) {
    req.cart.items.splice(idx, 1);
  } else {
    req.cart.items[idx].qty = q; // !!! dùng qty
  }

  await req.cart.save();
  await req.cart.populate({ path: "items.productId", select: "slug name" }); // !!!
  res.json(req.cart);
};

// DELETE /cart/items/:itemId
exports.removeItem = async (req, res) => {
  const { itemId } = req.params;
  const before = req.cart.items.length;
  req.cart.items = req.cart.items.filter((it) => String(it._id) !== String(itemId));
  if (req.cart.items.length === before) {
    return res.status(404).json({ message: "Không tìm thấy item trong giỏ" });
  }
  await req.cart.save();
  await req.cart.populate({ path: "items.productId", select: "slug name" }); // !!!
  res.json(req.cart);
};

// POST /cart/clear
exports.clearCart = async (req, res) => {
  req.cart.items = [];
  await req.cart.save();
  // có thể populate hoặc không, tuỳ bạn muốn trả gì
  await req.cart.populate({ path: "items.productId", select: "slug name" });
  res.json(req.cart);
};
