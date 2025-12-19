// 1. Kutubxonalarni import qilish
import { createClient } from '@supabase/supabase-js'

// 2. VITE da environment variable lar
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 3. Ma'lumotlar mavjudligini tekshirish
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ XATO: .env faylda Supabase ma\'lumotlari topilmadi!')
}

// 4. Supabase klientini yaratish
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

// 5. GET PROJECTS FUNKSIYASI
export const getProjects = async () => {
  console.log('📡 getProjects funksiyasi chaqirildi')
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Supabase xatosi:', error.message)
      const localData = localStorage.getItem('sherik_top_projects')
      return localData ? JSON.parse(localData) : []
    }
    
    console.log(`✅ ${data?.length || 0} ta loyiha yuklandi`)
    return data || []
    
  } catch (error) {
    console.error('❌ Kutilmagan xato:', error.message)
    return []
  }
}

// 6. CREATE PROJECT FUNKSIYASI
export const createProject = async (projectData) => {
  console.log('🔄 createProject chaqirildi:', projectData)
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        ...projectData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Supabase xatosi:', error.message)
      
      const projects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]')
      const newProject = {
        ...projectData,
        id: Date.now(),
        created_at: new Date().toISOString()
      }
      projects.push(newProject)
      localStorage.setItem('sherik_top_projects', JSON.stringify(projects))
      
      console.log('📦 LocalStorage ga saqlandi')
      return newProject
    }
    
    console.log('✅ Supabase ga saqlandi:', data)
    return data
    
  } catch (error) {
    console.error('❌ Kutilmagan xato:', error.message)
    return null
  }
}

// 7. GET CURRENT USER FUNKSIYASI (MUHIM! BU YO'Q EDİ)
export const getCurrentUser = async () => {
  console.log('👤 getCurrentUser chaqirildi')
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.log('ℹ️ Foydalanuvchi topilmadi')
      return null
    }
    
    console.log('✅ Foydalanuvchi:', user?.email || 'Anonim')
    return user
    
  } catch (error) {
    console.error('❌ Xato:', error.message)
    return null
  }
}

// 8. GitHub LOGIN FUNKSIYASI
export const signInWithGitHub = async () => {
  console.log('👥 signInWithGitHub chaqirildi')
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    })
    
    if (error) {
      console.error('❌ GitHub login xatosi:', error.message)
      return { data: null, error }
    }
    
    console.log('✅ GitHub login boshlandi')
    return { data, error: null }
    
  } catch (error) {
    console.error('❌ Kutilmagan xato:', error.message)
    return { data: null, error }
  }
}

// 9. LOGOUT FUNKSIYASI
export const signOut = async () => {
  console.log('🚪 signOut chaqirildi')
  
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Logout xatosi:', error.message)
      return { error }
    }
    
    console.log('✅ Muvaffaqiyatli logout')
    return { error: null }
    
  } catch (error) {
    console.error('❌ Kutilmagan xato:', error.message)
    return { error }
  }
}

// 10. QOLGAN FUNKSIYALAR...
export const updateProject = async (id, updates) => {
  console.log(`✏️ updateProject: ${id} yangilanmoqda`)
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
    
  } catch (error) {
    console.error('❌ Yangilashda xato:', error.message)
    return null
  }
}

export const deleteProject = async (id) => {
  console.log(`🗑️ deleteProject: ${id} o'chirilmoqda`)
  
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
    
  } catch (error) {
    console.error('❌ O\'chirishda xato:', error.message)
    return false
  }
}

export const getProjectById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
    
  } catch (error) {
    console.error('❌ Loyiha topilmadi:', error.message)
    return null
  }
}