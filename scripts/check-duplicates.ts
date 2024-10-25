import type { PrismaClient as PrismaClientType } from '@prisma/client';
const { PrismaClient } = require('@prisma/client') as { PrismaClient: typeof PrismaClientType };

const prisma = new PrismaClient();

async function checkDuplicates() {
  try {
    console.log('Checking for duplicate follows...');

    // Check for duplicates in follower_id + following_id
    const duplicateFollows = await prisma.$queryRaw`
      SELECT follower_id, following_id, COUNT(*)
      FROM "Follow"
      WHERE following_id IS NOT NULL
      GROUP BY follower_id, following_id
      HAVING COUNT(*) > 1;
    `;

    // Check for duplicates in follower_id + following_name
    const duplicateBrands = await prisma.$queryRaw`
      SELECT follower_id, following_name, COUNT(*)
      FROM "Follow"
      WHERE following_name IS NOT NULL
      GROUP BY follower_id, following_name
      HAVING COUNT(*) > 1;
    `;

    console.log('Duplicate follows:', duplicateFollows);
    console.log('Duplicate brand follows:', duplicateBrands);

  } catch (error) {
    console.error('Error checking duplicates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicates();