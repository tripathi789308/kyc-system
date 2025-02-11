// src/db.ts (Example - Create this file)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Database connection successful!');
    return prisma;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit the process if the database connection fails
  }
}

export { connectToDatabase, prisma }; // Export both the function and the client instance