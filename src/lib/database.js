import { createClient } from '@supabase/supabase-js';

// VAQTINCHA - to'g'ridan-to'g'ri
const supabaseUrl = 'https://rtroshkaccjoxeqolcyf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0cm9zaGthY2Nqb3hlcW9sY3lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1OTc4MzEsImV4cCI6MjA4MTE3MzgzMX0.vGe4z64_KHlnojBBSOi1A1Z0tciAJcwm3Y2XbEFpW6Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Loyihalarni olish
export async function getProjects({ limit = 50 } = {}) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data, error };
  } catch (error) {
    console.error('getProjects error:', error);
    return { data: null, error };
  }
}

// Loyiha yaratish
export async function createProject(projectData) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    return { data, error };
  } catch (error) {
    console.error('createProject error:', error);
    return { data: null, error };
  }
}

// GitHub kirish (hozircha ishlamaydi)
export async function signInWithGitHub() {
  return { error: { message: 'GitHub auth hozircha mavjud emas' } };
}

// Chiqish
export async function signOut() {
  return { error: null };
}

// Foydalanuvchini olish
export async function getCurrentUser() {
  return null;
}