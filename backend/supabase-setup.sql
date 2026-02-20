-- DreamFit Database Schema for Supabase

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image TEXT,
    slug VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    images TEXT[] DEFAULT '{}',
    category VARCHAR(100) REFERENCES categories(name),
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    num_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    order_number VARCHAR(50) UNIQUE,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(20) DEFAULT 'upi',
    order_status VARCHAR(20) DEFAULT 'pending',
    tracking_number VARCHAR(100),
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    upi_transaction_id VARCHAR(100),
    upi_qr_code TEXT,
    notes TEXT,
    status_history JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart table (for persistent cart storage)
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    size VARCHAR(20),
    color VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id, size, color)
);

-- Favorites/Wishlist table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    product_id INTEGER REFERENCES products(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- User profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    addresses JSONB DEFAULT '[]',
    wishlist INTEGER[] DEFAULT '{}',
    is_admin BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for categories (readable by all, modifiable by admin only)
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Categories are modifiable by admin only" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Policies for products (readable by all, modifiable by admin only)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are modifiable by admin only" ON products FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admin can view all orders" ON orders FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_id = auth.uid() AND is_admin = true
    )
);

-- Policies for cart items (users can only see and modify their own cart)
CREATE POLICY "Users can manage their own cart" ON cart_items FOR ALL USING (auth.uid() = user_id);

-- Policies for favorites (users can only see and modify their own favorites)
CREATE POLICY "Users can manage their own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- Policies for user profiles (users can see their own profile)
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, name, is_admin)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', COALESCE((NEW.raw_user_meta_data->>'isAdmin')::boolean, false));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO categories (name, description, image, slug) VALUES
    ('Dresses', 'Beautiful dresses for all occasions', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 'dresses'),
    ('Tops', 'Stylish tops and blouses', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', 'tops'),
    ('Bottoms', 'Comfortable pants and skirts', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', 'bottoms'),
    ('Accessories', 'Complete your look with accessories', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400', 'accessories')
ON CONFLICT (name) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, discount_price, images, category, sizes, colors, stock_quantity, featured) VALUES
    ('Elegant Evening Dress', 'Perfect for special occasions', 129.99, 99.99, ARRAY['https://images.unsplash.com/photo-1566479179817-c6e5d7ba5cec?w=400'], 'Dresses', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Navy', 'Burgundy'], 15, true),
    ('Casual Summer Dress', 'Light and comfortable for everyday wear', 69.99, NULL, ARRAY['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400'], 'Dresses', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Blue', 'Pink'], 25, true),
    ('Professional Blouse', 'Perfect for office wear', 49.99, 39.99, ARRAY['https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400'], 'Tops', ARRAY['XS', 'S', 'M', 'L'], ARRAY['White', 'Black', 'Grey'], 30, false),
    ('Cozy Sweater', 'Warm and stylish for cooler days', 79.99, NULL, ARRAY['https://images.unsplash.com/photo-1583743814966-8936f37f4f94?w=400'], 'Tops', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Cream', 'Brown', 'Black'], 20, true)
ON CONFLICT DO NOTHING;