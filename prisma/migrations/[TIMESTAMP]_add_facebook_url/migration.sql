-- AddFacebookUrl
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "facebook_url" TEXT;

-- AddDomainVerification
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "website_domain" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "domain_verified" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "verification_token" VARCHAR(255),
ADD COLUMN IF NOT EXISTS "verification_sent" TIMESTAMP(6);