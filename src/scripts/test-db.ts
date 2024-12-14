// src/scripts/test-db.ts
import { prisma } from "../lib/prisma";

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Successfully connected to database");

    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`Database has ${userCount} users`);

    // Test a follow query specifically since that's where we're seeing issues
    const followCount = await prisma.follow.count();
    console.log(`Database has ${followCount} follows`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testConnection().catch(console.error);
