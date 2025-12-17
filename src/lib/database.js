import { createClient } from '@supabase/supabase-js';

// Supabase sozlamalari
const supabaseUrl = 'https://vqbjifdxqwqfxsdwvjgk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

// Mock mode - agar Supabase ishlamasa
const USE_MOCK = true;

// ========== MOCK FUNKSIYALARI ==========
const mockProjects = [
  {
    id: '1',
    title: 'Startup Platformasi',
    description: 'Yoshlar uchun startup platformasi',
    category: 'Texnologiya',
    looking_for: ['Dasturchi', 'Dizayner'],
    stage: 'G\'oya',
    telegram: '@namdizayn',
    author: 'NamDTU',
    authorId: 'founder_nam',
    votes: 15,
    votedBy: [],
    comments: [],
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Online Ta\'lim Platformasi',
    description: 'O\'zbek tilida online kurslar',
    category: 'Ta\'lim',
    looking_for: ['Dasturchi', 'UI/UX Designer', 'Marketing'],
    stage: 'MVP',
    telegram: '@developer',
    author: 'Ali Valiyev',
    authorId: '2',
    votes: 8,
    votedBy: [],
    comments: [],
    created_at: new Date().toISOString()
  }
];

// ========== SUPABASE CLIENT ==========
let supabase;
if (!USE_MOCK) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase ga ulandi');
  } catch (error) {
    console.error('❌ Supabase client yaratishda xatolik:', error);
  }
}

// ========== LOYIHALARNI OLISH ==========
export const getProjects = async ({ limit = 50 } = {}) => {
  if (USE_MOCK) {
    console.log('📂 Mock loyihalar qaytarilmoqda');
    
    const savedProjects = localStorage.getItem('sherik_top_projects');
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      return { data: parsed.slice(0, limit), error: null };
    }
    
    localStorage.setItem('sherik_top_projects', JSON.stringify(mockProjects));
    return { data: mockProjects.slice(0, limit), error: null };
  }
  
  // Supabase versiyasi
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('❌ Supabase xatosi:', error);
      // Fallback to localStorage
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

// ========== LOYIHA YARATISH ==========
export const createProject = async (projectData) => {
  if (USE_MOCK) {
    console.log('📝 Mock loyiha yaratildi:', projectData);
    
    const savedProjects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
    const newProject = {
      ...projectData,
      id: Date.now().toString(),
      created_at: new Date().toISOString()
    };
    
    const updatedProjects = [newProject, ...savedProjects];
    localStorage.setItem('sherik_top_projects', JSON.stringify(updatedProjects));
    
    return { data: [newProject], error: null };
  }
  
  // Supabase versiyasi
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();
    
    if (error) {
      console.warn('⚠️ Supabase ga saqlash muvaffaqiyatsiz, localStorage ga saqlanmoqda');
      // Fallback to localStorage
      const savedProjects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
      const newProject = {
        ...projectData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      savedProjects.unshift(newProject);
      localStorage.setItem('sherik_top_projects', JSON.stringify(savedProjects));
      
      return { data: [newProject], error: null };
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ Loyiha yaratishda xatolik:', error);
    return { data: null, error };
  }
};

// ========== FOYDALANUVCHINI OLISH ==========
export const getCurrentUser = async () => {
  if (USE_MOCK) {
    console.log('👤 Mock foydalanuvchi');
    return { id: 'demo_user', email: 'demo@sherik.top' };
  }
  
  // Supabase versiyasi
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

// ========== GITHUB LOGIN ==========
export const signInWithGitHub = async () => {
  if (USE_MOCK) {
    console.log('🔑 Mock GitHub login');
    return { error: null };
  }
  
  // Supabase versiyasi
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github'
    });
    return { error };
  } catch (error) {
    console.error('❌ GitHub login xatosi:', error);
    return { error };
  }
};

// ========== LOGOUT ==========
export const signOut = async () => {
  if (USE_MOCK) {
    console.log('🚪 Mock logout');
    return { error: null };
  }
  
  // Supabase versiyasi
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('❌ Logout xatosi:', error);
    return { error };
  }
};

// ========== SUPABASE EXPORT ==========
export { supabase };