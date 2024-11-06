-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "website_domain" VARCHAR(255),
ADD COLUMN "domain_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "verification_token" VARCHAR(255),
ADD COLUMN "verification_sent" TIMESTAMP(6);