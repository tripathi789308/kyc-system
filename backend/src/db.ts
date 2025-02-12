import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connection successful!");
    return prisma;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

export { connectToDatabase, prisma };
