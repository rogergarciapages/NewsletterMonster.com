/*
  Warnings:

  - Changed the type of `post_id` on the `Comment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "post_id",
ADD COLUMN     "post_id" INTEGER NOT NULL;
