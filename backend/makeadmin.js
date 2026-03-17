const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'admin@store.com' },
    data: { role: 'ADMIN' },
  });
  console.log('Done! Role updated to:', user.role);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());