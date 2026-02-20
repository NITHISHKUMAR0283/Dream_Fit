-- Create product_tabs table for home page category filters
CREATE TABLE IF NOT EXISTS product_tabs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_id TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default product tabs (only if table is empty)
INSERT INTO product_tabs (tab_id, label, display_order)
SELECT * FROM (VALUES
  ('all', 'All Products', 1),
  ('dresses', 'Dresses', 2),
  ('tops', 'Tops & Tees', 3),
  ('bottoms', 'Bottoms', 4),
  ('accessories', 'Accessories', 5)
) AS v(tab_id, label, display_order)
WHERE NOT EXISTS (SELECT 1 FROM product_tabs);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_product_tabs_display_order ON product_tabs(display_order);
