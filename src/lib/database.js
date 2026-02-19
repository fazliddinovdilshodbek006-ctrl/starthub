// src/lib/database.js - TO'LIQ YANGILANGAN VERSIYA
import { supabase } from './supabase';

console.log('🚀 Database service ishga tushmoqda...');

// ==================== JWT AUTO REFRESH ====================
let refreshInterval = null;

// ✅ AUTO REFRESH - Har 50 daqiqada token yangilanadi
const startAutoRefresh = () => {
  if (refreshInterval) clearInterval(refreshInterval);
  
  refreshInterval = setInterval(async () => {
    try {
      console.log('🔄 Token avtomatik yangilanmoqda...');
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Token yangilanmadi:', error.message);
      } else {
        console.log('✅ Token muvaffaqiyatli yangilandi');
      }
    } catch (err) {
      console.error('❌ Refresh xatosi:', err);
    }
  }, 50 * 60 * 1000); // 50 daqiqa
  
  console.log('✅ Auto-refresh boshlandi (har 50 daqiqada)');
};

startAutoRefresh();

// ✅ SESSION MONITORING
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth event:', event);
  
  if (event === 'TOKEN_REFRESHED') {
    console.log('✅ Token yangilandi!');
  } else if (event === 'SIGNED_OUT') {
    console.log('🚪 User logout');
    stopAutoRefresh();
  } else if (event === 'SIGNED_IN') {
    console.log('✅ User login');
    startAutoRefresh();
  }
});

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log('🛑 Auto-refresh to\'xtatildi');
  }
};

// ==================== RETRY LOGIC ====================
const retryWithRefresh = async (fn, retries = 1) => {
  try {
    return await fn();
  } catch (error) {
    // JWT xatosi tekshirish
    const isJWTError = 
      error.code === 'PGRST301' || 
      error.message?.includes('JWT') || 
      error.message?.includes('expired') ||
      error.message?.includes('401');
    
    if (isJWTError && retries > 0) {
      console.log('⚠️ JWT xatosi aniqlandi, token yangilan moqda...');
      
      const { error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError) {
        console.log('✅ Token yangilandi, qayta urinish...');
        return await retryWithRefresh(fn, retries - 1);
      } else {
        console.error('❌ Token yangilash muvaffaqiyatsiz');
      }
    }
    
    throw error;
  }
};

// ==================== PROJECTS FUNKSIYALARI ====================

export const getProjects = async () => {
  console.log('📡 getProjects chaqirildi');
  
  try {
    const result = await retryWithRefresh(async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    });
    
    if (!result || result.length === 0) {
      console.log('ℹ️ Supabase da loyihalar yo\'q, localStorage tekshirilmoqda');
      const local = localStorage.getItem('sherik_top_projects');
      return local ? JSON.parse(local) : [];
    }
    
    console.log(`✅ ${result.length} ta loyiha yuklandi`);
    localStorage.setItem('sherik_top_projects', JSON.stringify(result));
    return result;
    
  } catch (error) {
    console.error('❌ getProjects xatosi:', error.message);
    
    // LocalStorage fallback
    const local = localStorage.getItem('sherik_top_projects');
    if (local) {
      const parsed = JSON.parse(local);
      console.log(`📦 LocalStorage dan ${parsed.length} ta loyiha yuklandi`);
      return parsed;
    }
    
    return [];
  }
};

export const createProject = async (projectData) => {
  console.log('🔄 createProject chaqirildi');
  
  try {
    const result = await retryWithRefresh(async () => {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...projectData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
    
    console.log('✅ Loyiha yaratildi');
    
    // LocalStorage yangilash
    const projects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
    projects.unshift(result);
    localStorage.setItem('sherik_top_projects', JSON.stringify(projects));
    
    return result;
    
  } catch (error) {
    console.error('❌ createProject xatosi:', error.message);
    
    // LocalStorage ga saqlash
    const newProject = {
      ...projectData,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const projects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
    projects.unshift(newProject);
    localStorage.setItem('sherik_top_projects', JSON.stringify(projects));
    
    console.log('📦 LocalStorage ga saqlandi');
    return newProject;
  }
};

export const updateProject = async (id, updates) => {
  console.log(`✏️ updateProject: ${id}`);
  
  try {
    const result = await retryWithRefresh(async () => {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
    
    // LocalStorage yangilash
    const projects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      localStorage.setItem('sherik_top_projects', JSON.stringify(projects));
    }
    
    return result;
    
  } catch (error) {
    console.error('❌ updateProject xatosi:', error.message);
    return null;
  }
};

export const deleteProject = async (id) => {
  console.log(`🗑️ deleteProject: ${id}`);
  
  try {
    await retryWithRefresh(async () => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    });
    
    // LocalStorage dan o'chirish
    const projects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem('sherik_top_projects', JSON.stringify(filtered));
    
    return true;
    
  } catch (error) {
    console.error('❌ deleteProject xatosi:', error.message);
    return false;
  }
};

// ==================== USER FUNKSIYALARI ====================

export const getCurrentUser = async () => {
  console.log('👤 getCurrentUser chaqirildi');
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    if (session?.user) {
      console.log('✅ Foydalanuvchi:', session.user.email);
      return session.user;
    }
    
    // OTP user tekshirish
    const otpEmail = localStorage.getItem('sherik_top_otp_email');
    const otpVerified = localStorage.getItem('sherik_top_otp_verified');
    
    if (otpEmail && otpVerified === 'true') {
      console.log('✅ OTP user:', otpEmail);
      return {
        id: 'otp-' + Date.now(),
        email: otpEmail,
        user_metadata: { name: 'OTP User' }
      };
    }
    
    console.log('ℹ️ Foydalanuvchi topilmadi');
    return null;
    
  } catch (error) {
    console.error('❌ getCurrentUser xatosi:', error.message);
    return null;
  }
};

export const signOut = async () => {
  console.log('🚪 signOut chaqirildi');
  
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    console.log('✅ Logout muvaffaqiyatli');
    
    // LocalStorage tozalash
    localStorage.removeItem('sherik_top_otp_email');
    localStorage.removeItem('sherik_top_otp_verified');
    localStorage.removeItem('sherik_top_projects');
    
    stopAutoRefresh();
    
    return { error: null };
    
  } catch (error) {
    console.error('❌ signOut xatosi:', error.message);
    return { error };
  }
};

// ==================== PROFILE FUNKSIYALARI ====================

export const getProfile = async (userId) => {
  console.log('👤 getProfile:', userId);
  
  try {
    const result = await retryWithRefresh(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ getProfile xatosi:', error.message);
    return null;
  }
};

export const updateProfile = async (userId, updates) => {
  console.log('✏️ updateProfile:', userId);
  
  try {
    const result = await retryWithRefresh(async () => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ updateProfile xatosi:', error.message);
    return null;
  }
};

// ==================== EXPORT ====================
export { supabase, startAutoRefresh, stopAutoRefresh };