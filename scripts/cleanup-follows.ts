import type { PrismaClient as PrismaClientType } from '@prisma/client';
const { PrismaClient } = require('@prisma/client') as { PrismaClient: typeof PrismaClientType };

const prisma = new PrismaClient();

async function cleanupFollows() {
  try {
    console.log('Starting cleanup process...');

    // Keep only the most recent follow for each unique combination
    await prisma.$executeRaw`
      WITH duplicates AS (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY follower_id, COALESCE(following_id, '00000000-0000-0000-0000-000000000000')
                 ORDER BY created_at DESC
               ) as row_num
        FROM "Follow"
        WHERE following_id IS NOT NULL
      )
      DELETE FROM "Follow"
      WHERE id IN (
        SELECT id FROM duplicates WHERE row_num > 1
      );
    `;

    // Do the same for brand follows
    await prisma.$executeRaw`
      WITH duplicates AS (
        SELECT id,
               ROW_NUMBER() OVER (
                 PARTITION BY follower_id, COALESCE(following_name, '')
                 ORDER BY created_at DESC
               ) as row_num
        FROM "Follow"
        WHERE following_name IS NOT NULL
      )
      DELETE FROM "Follow"
      WHERE id IN (
        SELECT id FROM duplicates WHERE row_num > 1
      );
    `;

    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning up follows:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupFollows();