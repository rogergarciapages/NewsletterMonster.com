-- DropForeignKey
ALTER TABLE "NewsletterTag" DROP CONSTRAINT "NewsletterTag_tag_id_fkey";

-- AlterTable
ALTER TABLE "NewsletterTag" ADD COLUMN     "userTagTag_id" INTEGER;

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_userTagTag_id_fkey" FOREIGN KEY ("userTagTag_id") REFERENCES "UserTag"("tag_id") ON DELETE SET NULL ON UPDATE CASCADE;
