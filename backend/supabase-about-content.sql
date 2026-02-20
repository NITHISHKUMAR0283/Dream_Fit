-- Create about_content table for customizable About page in Supabase
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'heading', 'text', 'image', 'stats', 'team', 'hero'
  display_order INTEGER NOT NULL DEFAULT 0,
  content JSONB NOT NULL, -- Flexible JSON content for each block type
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for better performance on ordering
CREATE INDEX IF NOT EXISTS idx_about_content_order ON about_content(display_order);

-- Insert default About page content
INSERT INTO about_content (type, display_order, content)
VALUES
  (
    'hero',
    1,
    '{
      "title": "Fashion That Tells Your Story",
      "subtitle": "At DreamFit, we believe every woman deserves to feel confident and beautiful. Our carefully curated collection brings you the latest trends and timeless classics.",
      "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=600&fit=crop"
    }'::jsonb
  ),
  (
    'heading',
    2,
    '{
      "level": 2,
      "text": "Our Story",
      "align": "left",
      "bold": true
    }'::jsonb
  ),
  (
    'text',
    3,
    '{
      "text": "Founded in 2020 with a simple dream - to make beautiful, high-quality fashion accessible to every woman. What started as a small boutique has grown into a trusted destination for fashion-forward women who value style, quality, and affordability.",
      "align": "left",
      "size": "base"
    }'::jsonb
  ),
  (
    'heading',
    4,
    '{
      "level": 2,
      "text": "Our Mission",
      "align": "left",
      "bold": true
    }'::jsonb
  ),
  (
    'text',
    5,
    '{
      "text": "To empower women through fashion by providing high-quality, stylish clothing that makes every woman feel confident and beautiful, regardless of the occasion.",
      "align": "left",
      "size": "base"
    }'::jsonb
  ),
  (
    'stats',
    6,
    '{
      "items": [
        {"label": "Happy Customers", "value": "10,000+"},
        {"label": "Products", "value": "500+"},
        {"label": "Cities Served", "value": "50+"},
        {"label": "Customer Satisfaction", "value": "99%"}
      ]
    }'::jsonb
  ),
  (
    'heading',
    7,
    '{
      "level": 2,
      "text": "Meet Our Team",
      "align": "center",
      "bold": true
    }'::jsonb
  ),
  (
    'team',
    8,
    '{
      "members": [
        {
          "name": "Priya Sharma",
          "role": "Founder & Creative Director",
          "image": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
          "bio": "With over 10 years in fashion design, Priya brings creativity and vision to every collection."
        },
        {
          "name": "Anita Patel",
          "role": "Head of Operations",
          "image": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
          "bio": "Anita ensures smooth operations and maintains our high standards of quality and service."
        },
        {
          "name": "Kavya Reddy",
          "role": "Customer Experience Manager",
          "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
          "bio": "Kavya is dedicated to making sure every customer has an exceptional shopping experience."
        }
      ]
    }'::jsonb
  )
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_about_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS about_content_updated_at ON about_content;
CREATE TRIGGER about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_about_content_updated_at();
