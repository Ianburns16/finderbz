-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('jobs', 'jobs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Allow public access to images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'jobs' OR bucket_id = 'portfolio');

-- Allow authenticated users to upload to jobs bucket
CREATE POLICY "Auth Upload Jobs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'jobs');

-- Allow authenticated users to upload to portfolio bucket
CREATE POLICY "Auth Upload Portfolio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio');
