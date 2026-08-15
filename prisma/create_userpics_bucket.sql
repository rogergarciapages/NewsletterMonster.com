-- prisma/create_userpics_bucket.sql
-- Create userpics bucket in Supabase Storage

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'userpics',
  'userpics',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Read Access on userpics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access on userpics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access on userpics" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access on userpics" ON storage.objects;

-- Create policies for public access and uploads
CREATE POLICY "Public Read Access on userpics"
ON storage.objects FOR SELECT
USING (bucket_id = 'userpics');

CREATE POLICY "Authenticated Upload Access on userpics"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'userpics');

CREATE POLICY "Authenticated Update Access on userpics"
ON storage.objects FOR UPDATE
USING (bucket_id = 'userpics');

CREATE POLICY "Authenticated Delete Access on userpics"
ON storage.objects FOR DELETE
USING (bucket_id = 'userpics');
