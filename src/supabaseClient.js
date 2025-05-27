import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL; // Matches your .env file
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY; // Matches your .env file

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Supabase URL or Key is missing in the environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
