// src/scripts/test-db.mjs
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "error", "warn"],
});

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to database");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);

    // Test a follow query
    const followCount = await prisma.follow.count();
    console.log(`Database has ${followCount} follows`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

testConnection().catch(console.error);
