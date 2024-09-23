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
    "post_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "CommentLike" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "comment_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
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
    "following_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "Follower" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "follower_id" UUID NOT NULL,
    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
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
    "user_id" UUID,
    "sender" VARCHAR(255),
    "date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "html_file_url" TEXT,
    "full_screenshot_url" TEXT,
    "top_screenshot_url" TEXT,
    "likes_count" INTEGER DEFAULT 0,
    "you_rocks_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("newsletter_id")
);
-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "profile_photo" TEXT,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "role" VARCHAR DEFAULT 'FREE',
    "full_name" VARCHAR,
    "bio" TEXT,
    "website" TEXT,
    "location" VARCHAR,
    "date_of_birth" DATE,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR DEFAULT 'active',
    "last_login" TIMESTAMP(6),
    "email_verified" TIMESTAMP(6),
    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
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
    "yourocked_item_id" UUID,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "YouRock_pkey" PRIMARY KEY ("yourock_id")
);
-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
-- AddForeignKey
ALTER TABLE "Bookmark"
ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "CommentLike"
ADD CONSTRAINT "CommentLike_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "CommentLike"
ADD CONSTRAINT "CommentLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Favorite"
ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Follow"
ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Follow"
ADD CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Follower"
ADD CONSTRAINT "Follower_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Follower"
ADD CONSTRAINT "Follower_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Like"
ADD CONSTRAINT "Like_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "Newsletter"("newsletter_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Like"
ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Newsletter"
ADD CONSTRAINT "Newsletter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "Post"
ADD CONSTRAINT "Post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "UserTag"
ADD CONSTRAINT "UserTag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
-- AddForeignKey
ALTER TABLE "YouRock"
ADD CONSTRAINT "YouRock_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;