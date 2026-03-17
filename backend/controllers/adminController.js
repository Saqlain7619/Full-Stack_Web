const prisma = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  const [totalUsers, totalOrders, totalProducts, revenueData, recentOrders, topProducts] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count(),
    prisma.product.count({ where: { active: true } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: 'CANCELLED' } } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { name:true, email:true } } } }),
    prisma.product.findMany({ take: 5, orderBy: { sold: 'desc' }, select: { name:true, sold:true, price:true, images:true } }),
  ]);
  res.json({ success: true, stats: { totalUsers, totalOrders, totalProducts, totalRevenue: revenueData._sum.total || 0, recentOrders, topProducts } });
};

exports.getUsers = async (req, res) => {
  const { page=1, limit=20 } = req.query;
  const skip = (parseInt(page)-1)*parseInt(limit);
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: parseInt(limit), select: { id:true, name:true, email:true, role:true, createdAt:true, _count: { select: { orders:true } } }, orderBy: { createdAt: 'desc' } }),
    prisma.user.count(),
  ]);
  res.json({ success: true, users, total });
};

exports.updateUser = async (req, res) => {
  const { role } = req.body;
  const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

exports.deleteUser = async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'User deleted' });
};
