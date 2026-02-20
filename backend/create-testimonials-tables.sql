-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  image TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_stats table
CREATE TABLE IF NOT EXISTS site_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  color TEXT DEFAULT 'pink-600',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default testimonials
INSERT INTO testimonials (name, role, image, rating, text, display_order) VALUES
('Priya Sharma', 'Fashion Blogger', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop', 5, 'DreamFit has completely transformed my wardrobe! The quality of their dresses is exceptional, and I always get compliments when I wear them. Highly recommended!', 1),
('Ananya Patel', 'Marketing Executive', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop', 5, 'I love how easy it is to find trendy outfits on DreamFit. The variety is amazing and the prices are very reasonable. This is now my go-to store for all occasions!', 2),
('Neha Gupta', 'Content Creator', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', 5, 'The customer service is outstanding! They helped me find the perfect dress for my event. The quality exceeded my expectations and the delivery was super fast.', 3);

-- Insert default site stats
INSERT INTO site_stats (stat_key, value, label, color, display_order) VALUES
('happy_customers', '10K+', 'Happy Customers', 'pink-600', 1),
('average_rating', '4.9/5', 'Average Rating', 'purple-600', 2),
('total_products', '500+', 'Products', 'rose-600', 3),
('satisfaction_rate', '99%', 'Satisfaction Rate', 'pink-600', 4);

-- Create instagram_posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  post_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default Instagram posts
INSERT INTO instagram_posts (image_url, post_url, display_order) VALUES
('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 1),
('https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 2),
('https://images.unsplash.com/photo-1544957992-20514f595d6f?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 3),
('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 4),
('https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 5),
('https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300&h=300&fit=crop', 'https://instagram.com/style._.fitz', 6);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_site_stats_display_order ON site_stats(display_order);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_display_order ON instagram_posts(display_order);
