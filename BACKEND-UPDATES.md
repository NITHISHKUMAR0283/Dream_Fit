# Backend Code Updates

## After running the SQL script, add these endpoints to your backend

### 1. Add Login Tracking Endpoint (in simple-working-server.js)

Add this code right after the Google OAuth endpoint (around line 748):

```javascript
// Track user login in database
async function trackUserLogin(userId, email, name, loginMethod = 'google', req) {
  try {
    const { error } = await supabase
      .from('user_login_history')
      .insert({
        user_id: userId,
        user_email: email,
        user_name: name,
        login_method: loginMethod,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('user-agent'),
        login_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking login:', error);
    }
  } catch (error) {
    console.error('Error in trackUserLogin:', error);
  }
}
```

### 2. Update Google OAuth Endpoint

Replace the Google OAuth endpoint (lines 659-748) with this updated version:

```javascript
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, isAdmin } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google credential'
      });
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Required user information not available from Google'
      });
    }

    const ADMIN_EMAIL = 'nk0283@srmist.edu.in';
    const userIsAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    const user = {
      id: googleId,
      email: email.toLowerCase(),
      name: name,
      is_admin: userIsAdmin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Track login in database
    await trackUserLogin(user.id, user.email, user.name, 'google', req);

    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: picture,
        isAdmin: user.is_admin,
        isVerified: true,
        wishlist: [],
        addresses: [],
        createdAt: user.created_at
      },
      token: token
    });
  } catch (error) {
    console.error('Google auth error details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during Google authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Authentication failed'
    });
  }
});
```

### 3. Add Admin Analytics Endpoints

Add these new endpoints at the end, before the 404 handler (around line 1453):

```javascript
// Admin Analytics Endpoints

// Get dashboard statistics
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    const { data, error } = await supabase
      .rpc('get_admin_dashboard_stats');

    if (error) throw error;

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
});

// Get all users with activity
app.get('/api/admin/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_user_activity')
      .select('*')
      .order('registered_at', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Get user login history
app.get('/api/admin/login-history', async (req, res) => {
  try {
    const { limit = 100, userId } = req.query;

    let query = supabase
      .from('user_login_history')
      .select('*')
      .order('login_at', { ascending: false })
      .limit(parseInt(limit));

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching login history',
      error: error.message
    });
  }
});

// Get daily login statistics
app.get('/api/admin/daily-login-stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;

    const { data, error } = await supabase
      .from('admin_daily_login_stats')
      .select('*')
      .limit(parseInt(days));

    if (error) throw error;

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching daily login stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily login statistics',
      error: error.message
    });
  }
});

// Get user count
app.get('/api/admin/user-count', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id', { count: 'exact', head: true });

    if (error) throw error;

    const { count } = await supabase
      .from('user_login_history')
      .select('user_id', { count: 'exact', head: true });

    res.json({
      success: true,
      data: {
        total_registered_users: data?.length || 0,
        total_logins_ever: count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user count',
      error: error.message
    });
  }
});
```

### 4. Fix Order Creation to Use Proper Calculation

Update the POST /api/orders endpoint (around line 1212) to include subtotal calculation:

```javascript
app.post('/api/orders', async (req, res) => {
  try {
    const {
      user_id,
      items,
      total_amount,
      shipping_address,
      payment_method,
      shipping_cost = 0,
      tax = 0
    } = req.body;

    if (!user_id || !items || !total_amount || !shipping_address || !payment_method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Calculate subtotal from items
    let calculated_subtotal = 0;
    items.forEach(item => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      calculated_subtotal += price * quantity;
    });

    // Validate total amount
    const calculated_total = calculated_subtotal + shipping_cost + tax;

    // Allow 1 rupee difference for rounding
    if (Math.abs(calculated_total - total_amount) > 1) {
      return res.status(400).json({
        success: false,
        message: 'Total amount mismatch. Please refresh and try again.',
        details: {
          calculated: calculated_total,
          received: total_amount,
          subtotal: calculated_subtotal,
          shipping: shipping_cost,
          tax: tax
        }
      });
    }

    // Generate order number
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const orderNumber = `ORD-${String((count || 0) + 1).padStart(6, '0')}`;

    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id,
        order_number: orderNumber,
        items,
        subtotal: calculated_subtotal,
        shipping_cost,
        tax,
        total_amount: calculated_total,
        status: 'pending',
        shipping_address,
        payment_method
      })
      .select()
      .single();

    if (error) throw error;

    // Clear user's cart after successful order
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});
```

## How to Apply These Changes

1. Open `backend/simple-working-server.js`
2. Add the `trackUserLogin` function after line 748
3. Replace the Google OAuth endpoint with the updated version
4. Add the admin analytics endpoints before the 404 handler
5. Update the POST /api/orders endpoint with the calculation fix
6. Restart the backend server

The changes will work immediately with the SQL fixes you apply in Supabase.
