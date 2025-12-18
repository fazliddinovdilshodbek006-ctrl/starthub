import { supabase } from './database';

export const testConnection = async () => {
  console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('🔑 Supabase Key mavjud:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  try {
    // Oddiy test query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase xatosi:', error);
      return false;
    }
    
    console.log('✅ Supabase ulanish muvaffaqiyatli!');
    return true;
  } catch (err) {
    console.error('❌ Kutilmagan xatolik:', err);
    return false;
  }
};