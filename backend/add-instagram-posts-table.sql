-- Only create the instagram_posts table (testimonials and site_stats already exist)

-- Create instagram_posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  post_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default Instagram posts (only if table is empty)
INSERT INTO instagram_posts (image_url, post_url, display_order)
SELECT * FROM (VALUES
  ('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 1),
  ('https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 2),
  ('https://images.unsplash.com/photo-1544957992-20514f595d6f?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 3),
  ('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 4),
  ('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 5),
  ('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 6)
) AS v(image_url, post_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM instagram_posts);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_instagram_posts_display_order ON instagram_posts(display_order);
