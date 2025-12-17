import { createClient } from '@supabase/supabase-js';

// Supabase sozlamalaringizni shu yerga yozing
const supabaseUrl = 'https://vqbjifdxqwqfxsdwvjgk.supabase.co'; // O'z project url ingizni qo'ying
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // O'z anon key ingizni qo'ying

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Loyihalarni olish
export const getProjects = async ({ limit = 50 } = {}) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Supabase xatosi:', error);
      // Agar table bo'lmasa, localStorage dan olish
      const savedProjects = localStorage.getItem('sherik_top_projects');
      if (savedProjects) {
        return { data: JSON.parse(savedProjects), error: null };
      }
      return { data: [], error: null };
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ Loyihalarni olishda xatolik:', error);
    return { data: [], error };
  }
};

// Loyiha yaratish
export const createProject = async (projectData) => {
  try {
    // Avval Supabase ga yozishga urinib ko'ramiz
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();
    
    if (!error && data) {
      console.log('✅ Supabase ga loyiha saqlandi');
      return { data, error };
    }
    
    // Agar Supabase da xatolik bo'lsa, localStorage ga saqlaymiz
    console.warn('⚠️ Supabase ga saqlash muvaffaqiyatsiz, localStorage ga saqlanmoqda');
    const savedProjects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    savedProjects.unshift(newProject);
    localStorage.setItem('sherik_top_projects', JSON.stringify(savedProjects));
    
    return { data: [newProject], error: null };
    
  } catch (error) {
    console.error('❌ Loyiha yaratishda xatolik:', error);
    return { data: null, error };
  }
};

// Foydalanuvchini olish
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.warn('⚠️ Foydalanuvchi olishda xatolik:', error.message);
      return null;
    }
    return user;
  } catch (error) {
    console.error('❌ Foydalanuvchini olishda xatolik:', error);
    return null;
  }
};

// GitHub orqali login
export const signInWithGitHub = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('❌ GitHub login xatosi:', error);
      // Mock login - demo uchun
      const mockUser = {
        id: 'demo_' + Date.now(),
        email: 'demo@github.com',
        user_metadata: { full_name: 'Demo User' }
      };
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
    }
    
    return { error };
  } catch (error) {
    console.error('❌ GitHub login xatosi:', error);
    return { error };
  }
};

// Logout
export const signOut = async () => {
  try {
    // LocalStorage ni tozalash
    localStorage.removeItem('demo_user');
    
    // Supabase dan chiqish
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Logout xatosi:', error);
    }
    
    return { error };
  } catch (error) {
    console.error('❌ Logout xatosi:', error);
    return { error };
  }
};