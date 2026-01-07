import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { seedNutrients } from "./nutrients";
import { seedAdmin } from "./admin";
import { seedAlice } from "./alice";
import { seedBob } from "./bob";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seed nutrients...")
  await seedNutrients(prisma);

  console.log("Seeding admin user...")
  await seedAdmin(prisma);

  console.log("Seeding Alice...")
  await seedAlice(prisma);

  console.log("Seeding Bob...")
  await seedBob(prisma);
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
