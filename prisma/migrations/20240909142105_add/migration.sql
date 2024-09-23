/*
  Warnings:

  - Added the required column `like_type` to the `CommentLike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CommentLike" ADD COLUMN     "like_type" TEXT NOT NULL;
