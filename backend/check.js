const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const users = await prisma.user.findMany({});
  console.log(users.map(u => ({ email: u.email, id: u.id })));
  const cart = await prisma.cart.findUnique({ where: { userId: user.id }, include: { items: { include: { product: true } } } });
  if (!cart) return console.log('cart not found');
  console.log(JSON.stringify(cart, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
