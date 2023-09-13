const { getHash } = require("../utils/passwordHash");
const { PrismaClient } = require("./client");
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@acmepets.test" },
    update: {},
    create: {
      email: "admin@acmepets.test",
      role: "admin",
      password: getHash(process.env.ADMIN_USER_PASSWORD),
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
