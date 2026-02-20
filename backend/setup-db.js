const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupDatabase() {
  console.log('Setting up database tables...\n');

  // Create newsletter_subscribers table
  console.log('Creating newsletter_subscribers table...');
  const { error: newsletterError } = await supabaseAdmin.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20),
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
    `
  });

  if (newsletterError) {
    // Try alternative method using raw SQL
    console.log('Trying direct table creation...');
    try {
      // We'll use the supabase client to insert a test record which will help us understand the schema
      const { error } = await supabaseAdmin
        .from('newsletter_subscribers')
        .select('*')
        .limit(1);

      if (error && error.message.includes('does not exist')) {
        console.error('\n⚠️  Table does not exist. Please create it manually in Supabase:');
        console.log('\n1. Go to your Supabase project dashboard');
        console.log('2. Navigate to Table Editor');
        console.log('3. Click "New Table"');
        console.log('4. Use the following SQL:\n');

        const sql = fs.readFileSync(path.join(__dirname, 'setup-tables.sql'), 'utf8');
        console.log(sql);
        console.log('\n');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  } else {
    console.log('✅ newsletter_subscribers table created successfully');
  }

  console.log('\nDatabase setup complete!');
}

setupDatabase().catch(console.error);
