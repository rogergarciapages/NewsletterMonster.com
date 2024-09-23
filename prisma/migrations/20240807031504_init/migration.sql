-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instagram_username" VARCHAR(255),
ADD COLUMN     "twitter_username" VARCHAR(255);

-- CreateTable
CREATE TABLE "NewsletterTag" (
    "newsletter_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "NewsletterTag_pkey" PRIMARY KEY ("newsletter_id","tag_id")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "post_id" UUID NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "Newsletter"("newsletter_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "UserTag"("tag_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "UserTag"("tag_id") ON DELETE CASCADE ON UPDATE NO ACTION;
