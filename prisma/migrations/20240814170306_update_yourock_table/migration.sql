/*
  Warnings:

  - Added the required column `yourocked_item_id` to the `YouRock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "YouRock" DROP COLUMN "yourocked_item_id",
ADD COLUMN     "yourocked_item_id" INTEGER NOT NULL;
