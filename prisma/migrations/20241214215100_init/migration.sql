-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "bookmark_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "bookmarked_item_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("bookmark_id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "parent_id" UUID,
    "post_id" INTEGER NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comment_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "like_type" TEXT NOT NULL,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "favorite_id" SERIAL NOT NULL,
    "user_id" UUID,
    "favorite_item_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("favorite_id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "follower_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "like_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "newsletter_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "Newsletter" (
    "newsletter_id" SERIAL NOT NULL,
    "subject" TEXT,
    "sender" TEXT,
    "sender_slug" TEXT,
    "html_file_url" TEXT,
    "full_screenshot_url" TEXT,
    "top_screenshot_url" TEXT,
    "content" TEXT,
    "summary" TEXT,
    "products_link" TEXT,
    "likes_count" INTEGER DEFAULT 0,
    "you_rocks_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "published_at" TIMESTAMP(3),
    "user_id" UUID,
    "brand_id" UUID,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("newsletter_id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "brand_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255),
    "username" VARCHAR(255),
    "email" TEXT NOT NULL,
    "profile_photo" TEXT,
    "password" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR NOT NULL DEFAULT 'FREE',
    "bio" TEXT,
    "website" TEXT,
    "location" VARCHAR(255),
    "date_of_birth" DATE,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(255) DEFAULT 'active',
    "last_login" TIMESTAMP(6),
    "emailVerified" TIMESTAMP(6),
    "provider" VARCHAR(255),

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "brand_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT,
    "website" TEXT,
    "domain" TEXT,
    "is_claimed" BOOLEAN NOT NULL DEFAULT false,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "BrandManager" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OWNER',
    "permissions" TEXT[] DEFAULT ARRAY['VIEW']::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,

    CONSTRAINT "BrandManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLinks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "instagram" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "youtube" TEXT,
    "github" TEXT,
    "user_id" UUID,
    "brand_id" UUID,

    CONSTRAINT "SocialLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTag" (
    "tag_id" SERIAL NOT NULL,
    "user_id" UUID,
    "tag" VARCHAR(255),

    CONSTRAINT "UserTag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "YouRock" (
    "yourock_id" SERIAL NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "yourocked_item_id" INTEGER NOT NULL,

    CONSTRAINT "YouRock_pkey" PRIMARY KEY ("yourock_id")
);

-- CreateTable
CREATE TABLE "NewsletterTag" (
    "newsletter_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "userTagTag_id" INTEGER,

    CONSTRAINT "NewsletterTag_pkey" PRIMARY KEY ("newsletter_id","tag_id")
);

-- CreateTable
CREATE TABLE "PostTag" (
    "post_id" UUID NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "PostTag_pkey" PRIMARY KEY ("post_id","tag_id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER DEFAULT 0,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "Follow_follower_id_idx" ON "Follow"("follower_id");

-- CreateIndex
CREATE INDEX "Follow_brand_id_idx" ON "Follow"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_follower_id_brand_id_key" ON "Follow"("follower_id", "brand_id");

-- CreateIndex
CREATE INDEX "Newsletter_user_id_idx" ON "Newsletter"("user_id");

-- CreateIndex
CREATE INDEX "Newsletter_brand_id_idx" ON "Newsletter"("brand_id");

-- CreateIndex
CREATE INDEX "Newsletter_sender_slug_idx" ON "Newsletter"("sender_slug");

-- CreateIndex
CREATE INDEX "Post_user_id_idx" ON "Post"("user_id");

-- CreateIndex
CREATE INDEX "Post_brand_id_idx" ON "Post"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_domain_key" ON "Brand"("domain");

-- CreateIndex
CREATE INDEX "Brand_slug_idx" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_domain_idx" ON "Brand"("domain");

-- CreateIndex
CREATE INDEX "BrandManager_user_id_idx" ON "BrandManager"("user_id");

-- CreateIndex
CREATE INDEX "BrandManager_brand_id_idx" ON "BrandManager"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "BrandManager_user_id_brand_id_key" ON "BrandManager"("user_id", "brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLinks_user_id_key" ON "SocialLinks"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "SocialLinks_brand_id_key" ON "SocialLinks"("brand_id");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "Newsletter"("newsletter_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Newsletter" ADD CONSTRAINT "Newsletter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Newsletter" ADD CONSTRAINT "Newsletter_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandManager" ADD CONSTRAINT "BrandManager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandManager" ADD CONSTRAINT "BrandManager_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLinks" ADD CONSTRAINT "SocialLinks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLinks" ADD CONSTRAINT "SocialLinks_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "Brand"("brand_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTag" ADD CONSTRAINT "UserTag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "YouRock" ADD CONSTRAINT "YouRock_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "Newsletter"("newsletter_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NewsletterTag" ADD CONSTRAINT "NewsletterTag_userTagTag_id_fkey" FOREIGN KEY ("userTagTag_id") REFERENCES "UserTag"("tag_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "UserTag"("tag_id") ON DELETE CASCADE ON UPDATE NO ACTION;
