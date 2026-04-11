const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const inactiveProducts = await prisma.product.findMany({ where: { active: false } });
  let deleted = 0;
  for (const p of inactiveProducts) {
    const orderCount = await prisma.orderItem.count({ where: { productId: p.id } });
    if (orderCount === 0) {
      await prisma.productRecommendation.deleteMany({
        where: { OR: [{ productId: p.id }, { recommendedProductId: p.id }] }
      });
      await prisma.product.delete({ where: { id: p.id } });
      deleted++;
    }
  }
  console.log(`Deleted ${deleted} inactive products.`);
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
