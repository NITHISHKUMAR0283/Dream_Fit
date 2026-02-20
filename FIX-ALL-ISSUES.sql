-- ========================================
-- DREAMFIT - FIX ALL ISSUES SQL SCRIPT
-- Run this in Supabase SQL Editor
-- ========================================

-- This script fixes:
-- 1. Cart isolation per user (already working, but we'll add constraints)
-- 2. Billing amount calculation (add proper constraints)
-- 3. User analytics tracking (login history, user count)
-- 4. Category images loading issue


-- ========================================
-- PART 1: USER LOGIN TRACKING
-- ========================================

-- Create user_login_history table to track all user logins
CREATE TABLE IF NOT EXISTS user_login_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    user_email TEXT,
    user_name TEXT,
    login_method VARCHAR(20) DEFAULT 'google', -- 'google', 'email', etc.
    ip_address TEXT,
    user_agent TEXT,
    login_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON user_login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_login_at ON user_login_history(login_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_user_email ON user_login_history(user_email);

-- Enable RLS for user_login_history
ALTER TABLE user_login_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy for login history (viewable by all for now - admin dashboard)
CREATE POLICY "Login history is viewable by everyone"
    ON user_login_history FOR SELECT
    USING (true);

CREATE POLICY "Login history is insertable by everyone"
    ON user_login_history FOR INSERT
    WITH CHECK (true);


-- ========================================
-- PART 2: UPDATE USER_PROFILES TABLE
-- Add last_login tracking
-- ========================================

-- Add last_login column if it doesn't exist
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_ip_address TEXT,
ADD COLUMN IF NOT EXISTS last_user_agent TEXT;

-- Create index for last_login
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_login ON user_profiles(last_login DESC);


-- ========================================
-- PART 3: FIX CART ISOLATION
-- Ensure cart items are properly isolated per user
-- ========================================

-- The cart_items table already has user_id with UNIQUE constraint
-- Let's ensure the constraint is properly set
-- Drop and recreate the unique constraint to be extra safe

ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_size_color_key;

ALTER TABLE cart_items
ADD CONSTRAINT cart_items_user_id_product_id_size_color_unique
UNIQUE (user_id, product_id, size, color);

-- Add index for faster cart queries per user
CREATE INDEX IF NOT EXISTS idx_cart_items_user_product ON cart_items(user_id, product_id);


-- ========================================
-- PART 4: FIX BILLING/ORDER AMOUNT ISSUES
-- Add constraints and validation
-- ========================================

-- Add check constraints to prevent negative or extremely large amounts
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_total_amount_check;
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_subtotal_check;

ALTER TABLE orders
ADD CONSTRAINT orders_total_amount_check
CHECK (total_amount >= 0 AND total_amount <= 10000000);

ALTER TABLE orders
ADD CONSTRAINT orders_subtotal_check
CHECK (subtotal >= 0 AND subtotal <= 10000000);

-- Add constraint for shipping cost
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_shipping_cost_check;
ALTER TABLE orders
ADD CONSTRAINT orders_shipping_cost_check
CHECK (shipping_cost >= 0 AND shipping_cost <= 100000);

-- Add constraint for tax
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_tax_check;
ALTER TABLE orders
ADD CONSTRAINT orders_tax_check
CHECK (tax >= 0 AND tax <= 1000000);


-- ========================================
-- PART 5: FIX CATEGORY IMAGES
-- Update existing categories with proper image URLs
-- ========================================

-- Update categories with proper image URLs
UPDATE categories
SET image = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop&q=80'
WHERE name = 'Dresses' AND (image IS NULL OR image = '' OR image = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400');

UPDATE categories
SET image = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=600&fit=crop&q=80'
WHERE name = 'Tops' AND (image IS NULL OR image = '' OR image = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400');

UPDATE categories
SET image = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop&q=80'
WHERE name = 'Bottoms' AND (image IS NULL OR image = '' OR image = 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400');

UPDATE categories
SET image = 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&h=600&fit=crop&q=80'
WHERE name = 'Accessories' AND (image IS NULL OR image = '' OR image = 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400');


-- ========================================
-- PART 6: CREATE ADMIN ANALYTICS VIEWS
-- These views help admin see user statistics
-- ========================================

-- View: Total users registered
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
    COUNT(DISTINCT user_id) as total_users,
    COUNT(DISTINCT CASE WHEN is_admin = true THEN user_id END) as total_admins,
    COUNT(DISTINCT CASE WHEN last_login >= NOW() - INTERVAL '7 days' THEN user_id END) as active_users_7days,
    COUNT(DISTINCT CASE WHEN last_login >= NOW() - INTERVAL '30 days' THEN user_id END) as active_users_30days,
    COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN user_id END) as new_users_7days,
    COUNT(DISTINCT CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN user_id END) as new_users_30days
FROM user_profiles;

-- View: Daily login statistics
CREATE OR REPLACE VIEW admin_daily_login_stats AS
SELECT
    DATE(login_at) as login_date,
    COUNT(*) as total_logins,
    COUNT(DISTINCT user_id) as unique_users
FROM user_login_history
GROUP BY DATE(login_at)
ORDER BY login_date DESC;

-- View: User activity summary
CREATE OR REPLACE VIEW admin_user_activity AS
SELECT
    up.user_id,
    up.name,
    up.email,
    up.is_admin,
    up.created_at as registered_at,
    up.last_login,
    up.login_count,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(o.total_amount), 0) as total_spent,
    COUNT(DISTINCT ci.id) as cart_items_count,
    COUNT(DISTINCT uf.id) as wishlist_count
FROM user_profiles up
LEFT JOIN orders o ON o.user_id = up.user_id
LEFT JOIN cart_items ci ON ci.user_id = up.user_id
LEFT JOIN user_favorites uf ON uf.user_id = up.user_id
GROUP BY up.user_id, up.name, up.email, up.is_admin, up.created_at, up.last_login, up.login_count
ORDER BY up.created_at DESC;

-- Grant SELECT permissions on views (for RLS)
ALTER VIEW admin_user_stats OWNER TO postgres;
ALTER VIEW admin_daily_login_stats OWNER TO postgres;
ALTER VIEW admin_user_activity OWNER TO postgres;


-- ========================================
-- PART 7: CREATE FUNCTION TO CALCULATE ORDER TOTAL CORRECTLY
-- This prevents billing amount multiplication issues
-- ========================================

CREATE OR REPLACE FUNCTION calculate_order_total(
    p_items JSONB,
    p_shipping_cost DECIMAL DEFAULT 0,
    p_tax DECIMAL DEFAULT 0
)
RETURNS JSONB AS $$
DECLARE
    v_subtotal DECIMAL := 0;
    v_total DECIMAL := 0;
    v_item JSONB;
    v_item_price DECIMAL;
    v_item_quantity INTEGER;
BEGIN
    -- Calculate subtotal from items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        v_item_price := COALESCE((v_item->>'price')::DECIMAL, 0);
        v_item_quantity := COALESCE((v_item->>'quantity')::INTEGER, 1);
        v_subtotal := v_subtotal + (v_item_price * v_item_quantity);
    END LOOP;

    -- Calculate total
    v_total := v_subtotal + COALESCE(p_shipping_cost, 0) + COALESCE(p_tax, 0);

    -- Return as JSONB
    RETURN jsonb_build_object(
        'subtotal', v_subtotal,
        'shipping_cost', COALESCE(p_shipping_cost, 0),
        'tax', COALESCE(p_tax, 0),
        'total', v_total
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;


-- ========================================
-- PART 8: CREATE TRIGGER TO UPDATE LOGIN COUNT
-- ========================================

CREATE OR REPLACE FUNCTION update_user_login_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user_profiles with last login info
    UPDATE user_profiles
    SET
        last_login = NEW.login_at,
        login_count = COALESCE(login_count, 0) + 1,
        last_ip_address = NEW.ip_address,
        last_user_agent = NEW.user_agent,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;

    -- If user doesn't exist in user_profiles, create a basic entry
    IF NOT FOUND THEN
        INSERT INTO user_profiles (user_id, email, last_login, login_count, created_at)
        VALUES (NEW.user_id, NEW.user_email, NEW.login_at, 1, NOW())
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS trigger_update_user_login_stats ON user_login_history;

CREATE TRIGGER trigger_update_user_login_stats
    AFTER INSERT ON user_login_history
    FOR EACH ROW
    EXECUTE FUNCTION update_user_login_stats();


-- ========================================
-- PART 9: ADD API ENDPOINT TRACKING TABLE (Optional)
-- Track which APIs are being used
-- ========================================

CREATE TABLE IF NOT EXISTS api_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time INTEGER, -- in milliseconds
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON api_usage_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage_logs(user_id);

-- Enable RLS
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "API usage logs are manageable by everyone"
    ON api_usage_logs FOR ALL
    USING (true);


-- ========================================
-- PART 10: SUMMARY STATISTICS FUNCTION
-- Quick function to get all admin statistics
-- ========================================

CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_users', (SELECT COUNT(DISTINCT user_id) FROM user_profiles),
        'total_orders', (SELECT COUNT(*) FROM orders),
        'total_revenue', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE status NOT IN ('cancelled', 'refunded')),
        'total_products', (SELECT COUNT(*) FROM products),
        'active_users_today', (SELECT COUNT(DISTINCT user_id) FROM user_login_history WHERE DATE(login_at) = CURRENT_DATE),
        'active_users_this_week', (SELECT COUNT(DISTINCT user_id) FROM user_login_history WHERE login_at >= NOW() - INTERVAL '7 days'),
        'active_users_this_month', (SELECT COUNT(DISTINCT user_id) FROM user_login_history WHERE login_at >= NOW() - INTERVAL '30 days'),
        'orders_today', (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE),
        'orders_this_week', (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '7 days'),
        'orders_this_month', (SELECT COUNT(*) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days'),
        'revenue_today', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE DATE(created_at) = CURRENT_DATE AND status NOT IN ('cancelled', 'refunded')),
        'revenue_this_week', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= NOW() - INTERVAL '7 days' AND status NOT IN ('cancelled', 'refunded')),
        'revenue_this_month', (SELECT COALESCE(SUM(total_amount), 0) FROM orders WHERE created_at >= NOW() - INTERVAL '30 days' AND status NOT IN ('cancelled', 'refunded')),
        'cart_items_count', (SELECT COUNT(*) FROM cart_items),
        'wishlist_items_count', (SELECT COUNT(*) FROM user_favorites),
        'newsletter_subscribers', (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true)
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;


-- ========================================
-- SUCCESS MESSAGE
-- ========================================

DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ALL FIXES APPLIED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Applied fixes:';
    RAISE NOTICE '1. ✓ User login tracking system created';
    RAISE NOTICE '2. ✓ Cart isolation constraints reinforced';
    RAISE NOTICE '3. ✓ Order amount validation constraints added';
    RAISE NOTICE '4. ✓ Category images updated with proper URLs';
    RAISE NOTICE '5. ✓ Admin analytics views created';
    RAISE NOTICE '6. ✓ User activity tracking enabled';
    RAISE NOTICE '';
    RAISE NOTICE 'New Features Available:';
    RAISE NOTICE '- View admin_user_stats for user statistics';
    RAISE NOTICE '- View admin_daily_login_stats for login trends';
    RAISE NOTICE '- View admin_user_activity for detailed user activity';
    RAISE NOTICE '- Function get_admin_dashboard_stats() for dashboard';
    RAISE NOTICE '';
    RAISE NOTICE 'To get dashboard stats, run:';
    RAISE NOTICE '  SELECT get_admin_dashboard_stats();';
    RAISE NOTICE '========================================';
END $$;
