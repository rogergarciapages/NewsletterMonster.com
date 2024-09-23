/*
  Warnings:

  - You are about to alter the column `full_name` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `location` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.
  - You are about to alter the column `status` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "linkedin_profile" TEXT,
ALTER COLUMN "full_name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "status" SET DATA TYPE VARCHAR(255);
