-- First, migrate data from Follower to Follow
INSERT INTO "Follow" (id, follower_id, following_id, created_at)
SELECT gen_random_uuid(),
    follower_id,
    user_id,
    CURRENT_TIMESTAMP
FROM "Follower" ON CONFLICT (follower_id, following_id) DO NOTHING;
-- Then drop the Follower table
DROP TABLE IF EXISTS "Follower";
-- Add the new following_name column to Follow
ALTER TABLE "Follow"
ADD COLUMN IF NOT EXISTS following_name TEXT;
-- Make following_id nullable
ALTER TABLE "Follow"
ALTER COLUMN following_id DROP NOT NULL;
-- Add unique constraint for unclaimed follows
ALTER TABLE "Follow"
ADD CONSTRAINT "Follow_follower_id_following_name_key" UNIQUE (follower_id, following_name);