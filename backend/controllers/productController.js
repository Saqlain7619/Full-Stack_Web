const prisma = require('../config/database');
const { paginate } = require('../utils/helpers');

const formatImagePath = (file) => {
  if (!file) return null;
  const p = file.path || file.filename;
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  const filename = p.includes('/') ? p.split('/').pop() : p;
  return `/uploads/${filename}`;
};

const parseImages = (body, files) => {
  if (files && files.length > 0) return files.map(formatImagePath).filter(Boolean);
  const raw = body.images;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch {}
    return raw.split(',').map(i => i.trim()).filter(Boolean);
  }
  return [];
};

const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch {}
    return raw.split(',').map(t => t.trim()).filter(Boolean);
  }
  return [];
};

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort = 'createdAt', order = 'desc', featured, admin } = req.query;
  const { take, skip } = paginate(page, limit);
  const where = admin === 'true' ? {} : { active: true };
  if (category) where.category = { slug: category };
  if (search) where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { description: { contains: search, mode: 'insensitive' } },
  ];
  if (minPrice || maxPrice) where.price = {
    ...(minPrice && { gte: parseFloat(minPrice) }),
    ...(maxPrice && { lte: parseFloat(maxPrice) }),
  };
  if (featured === 'true') where.featured = true;
  const sortMap = { price: { price: order }, rating: { rating: order }, name: { name: order }, newest: { createdAt: 'desc' }, default: { [sort]: order } };
  const orderBy = sortMap[sort] || sortMap.default;
  const [products, total] = await Promise.all([
    prisma.product.findMany({ where, take, skip, orderBy, include: { category: { select: { name: true, slug: true } } } }),
    prisma.product.count({ where }),
  ]);
  res.json({ success: true, products, total, page: parseInt(page), pages: Math.ceil(total / take) });
};

exports.getProduct = async (req, res) => {
  const product = await prisma.product.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }], active: true },
    include: { category: true, reviews: { include: { user: { select: { name: true, avatar: true } } }, orderBy: { createdAt: 'desc' }, take: 20 } },
  });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
};

exports.getFeatured = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { featured: true, active: true },
    take: 8,
    include: { category: { select: { name: true, slug: true } } },
  });
  res.json({ success: true, products });
};

exports.createProduct = async (req, res) => {
  console.log('FILES:', req.files);
  console.log('BODY:', req.body);

  const { name, description, price, comparePrice, categoryId, stock, featured } = req.body;

  if (req.files && req.files.length > 4) {
    return res.status(400).json({ success: false, message: 'Maximum 4 images allowed' });
  }

  // Cloudinary use hoga — file.path mein Cloudinary URL hoga, aur local par replace slashes
  const images = req.files?.map(file => file.path.replace(/\\/g, '/')) || [];

  const tags = parseTags(req.body.tags);
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();

  const product = await prisma.product.create({
    data: {
      name, slug, description,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : null,
      images,
      categoryId,
      stock: parseInt(stock) || 0,
      tags,
      featured: featured === 'true' || featured === true,
    },
    include: { category: true },
  });

  res.status(201).json({ success: true, product });
};

exports.updateProduct = async (req, res) => {
  const { name, description, price, comparePrice, categoryId, stock, featured, active } = req.body;
  const data = {};
  if (name !== undefined) { data.name = name; data.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''); }
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = parseFloat(price);
  if (comparePrice !== undefined) data.comparePrice = comparePrice ? parseFloat(comparePrice) : null;
  if (categoryId !== undefined) data.categoryId = categoryId;
  if (stock !== undefined) data.stock = parseInt(stock);
  if (req.body.tags !== undefined) data.tags = parseTags(req.body.tags);
  if (featured !== undefined) data.featured = featured === 'true' || featured === true;
  if (active !== undefined) data.active = active === 'true' || active === true;

  if (req.files && req.files.length > 0) {
    if (req.files.length > 4) return res.status(400).json({ success: false, message: 'Maximum 4 images allowed' });
    // Cloudinary URL hoga, aur local Windows paths fix
    data.images = req.files.map(file => file.path.replace(/\\/g, '/'));
  }

  const product = await prisma.product.update({ where: { id: req.params.id }, data, include: { category: true } });
  res.json({ success: true, product });
};

exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;
  
  // Force clean up any relations before deleting the product
  await prisma.cartItem.deleteMany({ where: { productId } });
  await prisma.orderItem.deleteMany({ where: { productId } });
  await prisma.productRecommendation.deleteMany({ 
    where: { OR: [{ productId }, { recommendedProductId: productId }] } 
  });
  
  await prisma.product.delete({ where: { id: productId } });

  res.json({ success: true, message: 'Product permanently deleted' });
};