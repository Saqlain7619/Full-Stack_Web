const prisma = require('../config/database');
const { generateOrderNumber } = require('../utils/helpers');

exports.createOrder = async (req, res) => {
  const { shippingAddress, paymentMethod = 'COD', notes } = req.body;
  const cart = await prisma.cart.findUnique({ where: { userId: req.user.id }, include: { items: { include: { product: true } } } });
  if (!cart?.items.length) return res.status(400).json({ success: false, message: 'Cart is empty' });

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product.name}` });
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: req.user.id,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        paymentMethod,
        notes,
        items: { create: cart.items.map(item => ({ productId: item.productId, quantity: item.quantity, price: item.product.price, size: item.size })) },
      },
      include: { items: { include: { product: true } } },
    });
    for (const item of cart.items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity }, sold: { increment: item.quantity } } });
    }
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  });

  res.status(201).json({ success: true, order });
};

exports.getMyOrders = async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: { select: { name:true, images:true } } } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, orders });
};

exports.getOrder = async (req, res) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id, ...(req.user.role !== 'ADMIN' && { userId: req.user.id }) },
    include: { items: { include: { product: true } }, user: { select: { name:true, email:true } } },
  });
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
};

exports.getAllOrders = async (req, res) => {
  const { page=1, limit=20, status } = req.query;
  const skip = (parseInt(page)-1)*parseInt(limit);
  const where = status ? { status } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, skip, take: parseInt(limit), include: { user: { select: { name:true, email:true } }, items: true }, orderBy: { createdAt: 'desc' } }),
    prisma.order.count({ where }),
  ]);
  res.json({ success: true, orders, total });
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status }, include: { user: { select: { name:true, email:true } } } });
  res.json({ success: true, order });
};
