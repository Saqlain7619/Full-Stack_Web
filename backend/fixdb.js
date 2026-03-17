const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Fake category delete karo
  await prisma.category.deleteMany({
    where: { name: 'node makeadmin.js' }
  });
  console.log('Fake category deleted!');

  // Check karo kitni real categories hain
  const cats = await prisma.category.findMany();
  console.log('Total categories:', cats.length);
  cats.forEach(c => console.log(' -', c.name));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());