const prisma = require('../config/database');

exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' }
  });
  res.json({ success: true, categories });
};

exports.getCategory = async (req, res) => {
  const category = await prisma.category.findFirst({
    where: { OR: [{ id: req.params.id }, { slug: req.params.id }] }
  });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  res.json({ success: true, category });
};

exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  // ✅ Fix: const lagao, file.path nahi file.filename use karo
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const category = await prisma.category.create({
    data: { name, slug, description, image }
  });
  res.status(201).json({ success: true, category });
};

exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;
  const data = { description };
  if (name) {
    data.name = name;
    data.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  }
  // ✅ Fix: sirf file.filename use karo, file.path nahi
  if (req.file) data.image = `/uploads/${req.file.filename}`;

  const category = await prisma.category.update({
    where: { id: req.params.id }, data
  });
  res.json({ success: true, category });
};

exports.deleteCategory = async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Category deleted' });
};