const prisma = require('../config/database');

exports.getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: { where: { active: true } } } } },
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
  const image = req.file ? req.file.path?.replace(/\\/g, '/') : null;

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
  if (req.file) data.image = req.file.path?.replace(/\\/g, '/');

  const category = await prisma.category.update({
    where: { id: req.params.id }, data
  });
  res.json({ success: true, category });
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  // Check if any products are linked to this category
  const productsCount = await prisma.product.count({
    where: { categoryId }
  });

  if (productsCount > 0) {
    return res.status(400).json({ 
      success: false, 
      message: `Cannot delete category. It contains ${productsCount} product(s). Please delete or reassign them first.` 
    });
  }

  await prisma.category.delete({ where: { id: categoryId } });
  res.json({ success: true, message: 'Category deleted' });
};