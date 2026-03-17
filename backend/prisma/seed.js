const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.com' },
    update: {},
    create: {
      email: 'admin@store.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash('user123', 12);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
    },
  });

  // Create categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Home decor and garden supplies', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment and accessories', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400' },
    { name: 'Books', slug: 'books', description: 'Books and educational materials', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' },
    { name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
  ];

  const createdCategories = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created;
  }

  // Create products
  const products = [
    {
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'The latest iPhone with A17 Pro chip, titanium design, and a 48MP camera system. Features ProMotion display and all-day battery life.',
      price: 1199.99,
      comparePrice: 1299.99,
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600',
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600',
      ],
      stock: 50,
      featured: true,
      categorySlug: 'electronics',
      tags: ['smartphone', 'apple', 'ios'],
    },
    {
      name: 'Samsung 65" QLED TV',
      slug: 'samsung-65-qled-tv',
      description: '4K QLED display with Quantum HDR and Object Tracking Sound. Smart TV with built-in streaming apps.',
      price: 899.99,
      comparePrice: 1199.99,
      images: [
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600',
      ],
      stock: 20,
      featured: true,
      categorySlug: 'electronics',
      tags: ['tv', 'samsung', '4k'],
    },
    {
      name: 'Sony WH-1000XM5 Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise cancellation with 30-hour battery life. Multipoint connection and speak-to-chat technology.',
      price: 349.99,
      comparePrice: 399.99,
      images: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
      ],
      stock: 75,
      featured: true,
      categorySlug: 'electronics',
      tags: ['headphones', 'sony', 'audio'],
    },
    {
      name: 'MacBook Air M3',
      slug: 'macbook-air-m3',
      description: 'Supercharged by M3 chip. 18 hours of battery life, stunning Liquid Retina display, and fanless silent performance.',
      price: 1299.99,
      comparePrice: 1499.99,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600',
      ],
      stock: 30,
      featured: true,
      categorySlug: 'electronics',
      tags: ['laptop', 'apple', 'macbook'],
    },
    {
      name: 'Premium Running Jacket',
      slug: 'premium-running-jacket',
      description: 'Lightweight, water-resistant running jacket with reflective details. Perfect for all weather conditions.',
      price: 89.99,
      comparePrice: 129.99,
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600',
      ],
      stock: 100,
      featured: false,
      categorySlug: 'clothing',
      tags: ['jacket', 'running', 'sportswear'],
    },
    {
      name: 'Classic Denim Jeans',
      slug: 'classic-denim-jeans',
      description: 'Premium quality straight-fit denim jeans. Comfortable and durable for everyday wear.',
      price: 59.99,
      comparePrice: 79.99,
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
      ],
      stock: 200,
      featured: false,
      categorySlug: 'clothing',
      tags: ['jeans', 'denim', 'casual'],
    },
    {
      name: 'Ergonomic Office Chair',
      slug: 'ergonomic-office-chair',
      description: 'Full lumbar support with adjustable armrests and headrest. Mesh back for breathability during long work sessions.',
      price: 449.99,
      comparePrice: 599.99,
      images: [
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600',
      ],
      stock: 25,
      featured: true,
      categorySlug: 'home-garden',
      tags: ['chair', 'office', 'ergonomic'],
    },
    {
      name: 'Indoor Plant Collection',
      slug: 'indoor-plant-collection',
      description: 'Set of 3 low-maintenance indoor plants. Includes pothos, snake plant, and peace lily with ceramic pots.',
      price: 49.99,
      comparePrice: null,
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600',
      ],
      stock: 60,
      featured: false,
      categorySlug: 'home-garden',
      tags: ['plants', 'indoor', 'home-decor'],
    },
    {
      name: 'Professional Yoga Mat',
      slug: 'professional-yoga-mat',
      description: 'Extra thick 6mm non-slip yoga mat with alignment lines. Eco-friendly TPE material, perfect for all types of yoga.',
      price: 39.99,
      comparePrice: 59.99,
      images: [
        'https://images.unsplash.com/photo-1601925228560-9aba6b55e3c6?w=600',
      ],
      stock: 150,
      featured: false,
      categorySlug: 'sports',
      tags: ['yoga', 'fitness', 'mat'],
    },
    {
      name: 'Atomic Habits - James Clear',
      slug: 'atomic-habits-james-clear',
      description: 'The #1 New York Times bestseller. Learn how tiny changes can lead to remarkable results in your personal and professional life.',
      price: 16.99,
      comparePrice: 24.99,
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600',
      ],
      stock: 300,
      featured: false,
      categorySlug: 'books',
      tags: ['self-help', 'habits', 'productivity'],
    },
    {
      name: 'Vitamin C Serum',
      slug: 'vitamin-c-serum',
      description: 'Brightening vitamin C serum with hyaluronic acid and niacinamide. Reduces dark spots and evens skin tone.',
      price: 29.99,
      comparePrice: 44.99,
      images: [
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600',
      ],
      stock: 200,
      featured: false,
      categorySlug: 'beauty',
      tags: ['skincare', 'serum', 'vitamin-c'],
    },
    {
      name: 'Wireless Gaming Mouse',
      slug: 'wireless-gaming-mouse',
      description: 'Ultra-lightweight wireless gaming mouse with 25,600 DPI sensor. 70-hour battery life and RGB lighting.',
      price: 79.99,
      comparePrice: 99.99,
      images: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600',
      ],
      stock: 80,
      featured: true,
      categorySlug: 'electronics',
      tags: ['gaming', 'mouse', 'wireless'],
    },
  ];

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        rating: Math.random() * 2 + 3,
        reviewCount: Math.floor(Math.random() * 200),
        sold: Math.floor(Math.random() * 500),
        categoryId: createdCategories[categorySlug].id,
      },
    });
  }

  console.log('Seeding complete!');
  console.log('Admin: admin@store.com / admin123');
  console.log('User: user@example.com / user123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
