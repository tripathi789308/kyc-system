import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("superadmin", 10);

  const user = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      name: "Super Admin",
      age: 30,
      fileSource: "",
      email: "superadmin@example.com",
      password: hashedPassword,
      role: "SUPER",
      assignedRole: "SUPER",
      kycStatus: "APPROVED",
    },
  });

  console.log("Seeded Super Admin:", user);
}

main()
  .catch((e) => {
    console.error("Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
