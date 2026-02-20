const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

(async () => {
  console.log('🔄 Updating product stock values...');

  try {
    // Update all products to have stock
    const { data, error } = await supabase
      .from('products')
      .update({
        in_stock: true,
        stock_quantity: 50
      })
      .not('id', 'is', null); // Update all products

    if (error) {
      console.error('❌ Error updating products:', error);
      return;
    }

    console.log('✅ Updated product stock values');

    // Verify the update
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, name, in_stock, stock_quantity')
      .limit(3);

    if (fetchError) {
      console.error('❌ Error fetching products:', fetchError);
      return;
    }

    console.log('📦 Updated products:');
    products.forEach(p => {
      console.log(`  - ${p.name}: in_stock=${p.in_stock}, stock_quantity=${p.stock_quantity}`);
    });

  } catch (err) {
    console.error('❌ Script error:', err);
  }
})();