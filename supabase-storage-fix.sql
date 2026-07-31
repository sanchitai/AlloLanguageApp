-- Run this in Supabase SQL Editor
-- https://supabase.com/dashboard/project/cbpggbzhufdxdpoqmbhn/sql

-- Drop old broken policies
DROP POLICY IF EXISTS "Service role can upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read audio" ON storage.objects;

-- Allow authenticated users to upload audio
CREATE POLICY "Auth users can upload audio"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'audio');

-- Allow authenticated users to read their audio
CREATE POLICY "Auth users can read audio"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'audio');

-- Allow anon (guests) to read audio too
CREATE POLICY "Anon can read audio"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'audio');

-- Allow authenticated users to update (upsert)
CREATE POLICY "Auth users can update audio"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'audio');
