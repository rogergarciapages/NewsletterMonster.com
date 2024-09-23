-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";
-- AlterTable
ALTER TABLE "Account"
ALTER COLUMN "userId"
SET DATA TYPE UUID USING "userId"::uuid;
-- AddForeignKey
ALTER TABLE "Account"
ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;