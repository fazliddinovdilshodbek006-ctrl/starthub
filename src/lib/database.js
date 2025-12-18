// src/lib/database.js - TO'LIQ YANGI VERSIYA
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== AUTH ====================

export const signInWithGitHub = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: window.location.origin
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// ==================== PROFILES ====================

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
};

export const createProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
  
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
};

export const searchProfiles = async (filters = {}) => {
  let query = supabase.from('profiles').select('*');
  
  if (filters.role) {
    query = query.eq('role', filters.role);
  }
  
  if (filters.level) {
    query = query.eq('level', filters.level);
  }
  
  if (filters.skills && filters.skills.length > 0) {
    query = query.contains('skills', filters.skills);
  }
  
  if (filters.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// ==================== PROJECTS ====================

export const getProjects = async (filters = {}) => {
  let query = supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!projects_creator_id_fkey(id, full_name, email, avatar_url, telegram_username)
    `);
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.creatorId) {
    query = query.eq('creator_id', filters.creatorId);
  }
  
  if (filters.requiredSkills && filters.requiredSkills.length > 0) {
    query = query.contains('required_skills', filters.requiredSkills);
  }
  
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  const { data, error } = await query
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getProject = async (projectId) => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!projects_creator_id_fkey(id, full_name, email, avatar_url, telegram_username)
    `)
    .eq('id', projectId)
    .single();
  
  return { data, error };
};

export const createProject = async (projectData) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { data: null, error: { message: 'Tizimga kirish kerak' } };
  }
  
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...projectData,
      creator_id: user.id
    }])
    .select(`
      *,
      creator:profiles!projects_creator_id_fkey(id, full_name, email, avatar_url, telegram_username)
    `)
    .single();
  
  return { data, error };
};

export const updateProject = async (projectId, updates) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select(`
      *,
      creator:profiles!projects_creator_id_fkey(id, full_name, email, avatar_url, telegram_username)
    `)
    .single();
  
  return { data, error };
};

export const deleteProject = async (projectId) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  
  return { error };
};

// ==================== VOTES ====================

export const voteProject = async (projectId) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { data: null, error: { message: 'Ovoz berish uchun tizimga kirish kerak' } };
  }
  
  // Avval ovoz bor-yo'qligini tekshirish
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', user.id)
    .eq('project_id', projectId)
    .single();
  
  if (existingVote) {
    // Agar ovoz berilgan bo'lsa, uni o'chirish (unlike)
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('user_id', user.id)
      .eq('project_id', projectId);
    
    return { data: { voted: false }, error };
  } else {
    // Yangi ovoz berish
    const { data, error } = await supabase
      .from('votes')
      .insert([{
        user_id: user.id,
        project_id: projectId
      }])
      .select()
      .single();
    
    return { data: { voted: true }, error };
  }
};

export const getUserVotes = async () => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { data: [], error: null };
  }
  
  const { data, error } = await supabase
    .from('votes')
    .select('project_id')
    .eq('user_id', user.id);
  
  return { data: data?.map(v => v.project_id) || [], error };
};

export const getProjectVotes = async (projectId) => {
  const { data, error } = await supabase
    .from('votes')
    .select('*, user:profiles(id, full_name, avatar_url)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// ==================== COMMENTS ====================

export const getComments = async (projectId) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:profiles(id, full_name, avatar_url, email)
    `)
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const createComment = async (projectId, content) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { data: null, error: { message: 'Comment yozish uchun tizimga kirish kerak' } };
  }
  
  const { data, error } = await supabase
    .from('comments')
    .insert([{
      user_id: user.id,
      project_id: projectId,
      content
    }])
    .select(`
      *,
      user:profiles(id, full_name, avatar_url, email)
    `)
    .single();
  
  return { data, error };
};

export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  
  return { error };
};

export const updateComment = async (commentId, content) => {
  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .select(`
      *,
      user:profiles(id, full_name, avatar_url, email)
    `)
    .single();
  
  return { data, error };
};

// ==================== MATCHING ALGORITHM ====================

export const getRecommendedProjects = async (userId) => {
  // 1. Foydalanuvchi profilini olish
  const { data: userProfile } = await getProfile(userId);
  
  if (!userProfile || !userProfile.skills || userProfile.skills.length === 0) {
    // Agar skills bo'lmasa, umumiy loyihalarni qaytarish
    return await getProjects({ limit: 10 });
  }
  
  // 2. Foydalanuvchi skillsiga mos loyihalarni topish
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:profiles!projects_creator_id_fkey(id, full_name, email, avatar_url, telegram_username)
    `)
    .overlaps('required_skills', userProfile.skills)
    .neq('creator_id', userId)
    .eq('status', 'active')
    .order('votes_count', { ascending: false })
    .limit(10);
  
  return { data, error };
};

export const getRecommendedPartners = async (projectId) => {
  // 1. Loyihani olish
  const { data: project } = await getProject(projectId);
  
  if (!project || !project.required_skills || project.required_skills.length === 0) {
    return { data: [], error: null };
  }
  
  // 2. Loyiha uchun kerakli skillsga ega foydalanuvchilarni topish
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .overlaps('skills', project.required_skills)
    .neq('id', project.creator_id)
    .order('created_at', { ascending: false })
    .limit(10);
  
  return { data, error };
};