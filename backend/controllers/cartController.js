const prisma = require('../config/database');

const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: { include: { category: { select: { name:true } } } } } } } });
  if (!cart) cart = await prisma.cart.create({ data: { userId }, include: { items: { include: { product: { include: { category: { select: { name:true } } } } } } } });
  return cart;
};

exports.getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart });
};

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });
  let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
  if (!cart) cart = await prisma.cart.create({ data: { userId: req.user.id } });
  const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId } } });
  if (existing) {
    await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: existing.quantity + parseInt(quantity) } });
  } else {
    await prisma.cartItem.create({ data: { cartId: cart.id, productId, quantity: parseInt(quantity) } });
  }
  const updatedCart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart: updatedCart });
};

exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: req.params.itemId } });
  } else {
    await prisma.cartItem.update({ where: { id: req.params.itemId }, data: { quantity: parseInt(quantity) } });
  }
  const cart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart });
};

exports.removeFromCart = async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.itemId } });
  const cart = await getOrCreateCart(req.user.id);
  res.json({ success: true, cart });
};

exports.clearCart = async (req, res) => {
  const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
  if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  res.json({ success: true, message: 'Cart cleared' });
};
