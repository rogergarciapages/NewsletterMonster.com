import { PrismaClient } from '@prisma/client';

interface FollowerRecord {
  id: number;
  user_id: string;
  follower_id: string;
}

const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Get all existing followers
    const existingFollowers = await prisma.$queryRaw<FollowerRecord[]>`
      SELECT id, user_id, follower_id FROM "Follower"
    `;

    console.log(`Found ${existingFollowers.length} followers to migrate`);

    // 2. Migrate each follower to the new Follow model
    for (const follower of existingFollowers) {
      try {
        await prisma.follow.create({
          data: {
            follower_id: follower.follower_id,
            following_id: follower.user_id,
            created_at: new Date(),
          },
        });
        console.log(`Migrated follow relationship: ${follower.follower_id} -> ${follower.user_id}`);
      } catch (e: any) {
        if (e.code === 'P2002') {
          console.log(`Skipping duplicate follow relation: ${follower.follower_id} -> ${follower.user_id}`);
        } else {
          console.error(`Error migrating follow relationship: ${follower.follower_id} -> ${follower.user_id}`, e);
        }
      }
    }

    console.log('Migration completed successfully');

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });