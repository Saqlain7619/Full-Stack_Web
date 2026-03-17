const prisma = require('../config/database');

exports.getProductReviews = async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { productId: req.params.productId },
    include: { user: { select: { name:true, avatar:true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json({ success: true, reviews });
};

exports.createReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const { productId } = req.params;
  const existing = await prisma.review.findUnique({ where: { userId_productId: { userId: req.user.id, productId } } });
  if (existing) return res.status(409).json({ success: false, message: 'You already reviewed this product' });
  const review = await prisma.review.create({ data: { rating: parseInt(rating), title, comment, userId: req.user.id, productId }, include: { user: { select: { name:true, avatar:true } } } });
  const stats = await prisma.review.aggregate({ where: { productId }, _avg: { rating: true }, _count: true });
  await prisma.product.update({ where: { id: productId }, data: { rating: stats._avg.rating || 0, reviewCount: stats._count } });
  res.status(201).json({ success: true, review });
};

exports.deleteReview = async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } });
  if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
  if (review.userId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ success: false, message: 'Not authorized' });
  await prisma.review.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Review deleted' });
};
