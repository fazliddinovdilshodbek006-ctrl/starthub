import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rtroshkaccjoxeqolcyf.supabase.co';
const supabaseAnonKey = 'sb_publishable_ERjss7e36V5TGsTGI_K7NA_IJWDAawu'; // Publishable kalit

export const supabase = createClient(supabaseUrl, supabaseAnonKey);