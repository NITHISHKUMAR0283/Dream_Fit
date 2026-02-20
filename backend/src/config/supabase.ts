import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  logger.error('❌ Supabase credentials missing in environment variables');
  throw new Error('Missing Supabase credentials');
}

// Create Supabase client with service key for backend operations
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Test connection function
export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    logger.info('🔄 Testing Supabase connection...');

    const { data, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (error) {
      logger.error('❌ Supabase connection test failed:', error.message);
      logger.error('Error details:', error);
      return false;
    }

    logger.info('✅ Supabase connection successful');
    logger.info('Test query result:', data);
    return true;
  } catch (error: any) {
    logger.error('❌ Supabase connection error:', error.message);
    logger.error('Full error:', error);
    return false;
  }
};

export default supabase;