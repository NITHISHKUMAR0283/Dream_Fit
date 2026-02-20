-- Add Hero Images Table for Home Page
-- Run this in Supabase SQL Editor

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    title VARCHAR(255),
    subtitle TEXT,
    position VARCHAR(50) DEFAULT 'main', -- 'main', 'secondary', etc.
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active, display_order);

-- Enable RLS
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Hero images are viewable by everyone"
    ON hero_images FOR SELECT
    USING (true);

CREATE POLICY "Hero images are manageable by everyone"
    ON hero_images FOR ALL
    USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_hero_images_updated_at
    BEFORE UPDATE ON hero_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default hero image
INSERT INTO hero_images (image_url, title, subtitle, position, is_active, display_order)
VALUES (
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=700&fit=crop&q=80',
    'Discover Your Perfect Style',
    'Latest Fashion Trends 2025',
    'main',
    true,
    1
)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Hero images table created successfully!';
    RAISE NOTICE 'You can now upload and manage hero images for the home page';
END $$;
