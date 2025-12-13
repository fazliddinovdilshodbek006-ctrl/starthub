import { createClient } from '@supabase/supabase-js'

// Environment o'zgaruvchilarini tekshirish
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// ===== DEBUG QO'SHISH (mavjud kodni buzmasdan) =====
console.log('🛠️ Supabase.js fayli ishga tushdi')
console.log('URL:', supabaseUrl ? '✅ Mavjud' : '❌ Yo\'q')
console.log('KEY:', supabaseAnonKey ? `✅ ${supabaseAnonKey.length} belgi` : '❌ Yo\'q')
// ===================================================

// Client yaratish
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Diqqat: Supabase URL yoki KEY topilmadi!')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export { supabase }