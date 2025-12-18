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
  let query = supabase.from('projects').select('*');
  
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
  
  const { data: projects, error } = await query
    .order('votes_count', { ascending: false })
    .order('created_at', { ascending: false });
  
  if (error) return { data: null, error };
  
  // Har bir project uchun creator ma'lumotlarini olamiz
  if (projects && projects.length > 0) {
    const projectsWithCreators = await Promise.all(
      projects.map(async (project) => {
        if (project.creator_id) {
          const { data: creator } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, telegram_username')
            .eq('id', project.creator_id)
            .single();
          
          return { ...project, creator };
        }
        return project;
      })
    );
    
    return { data: projectsWithCreators, error: null };
  }
  
  return { data: projects, error };
};

export const getProject = async (projectId) => {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error) return { data: null, error };
  
  if (project && project.creator_id) {
    const { data: creator } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, telegram_username')
      .eq('id', project.creator_id)
      .single();
    
    return { data: { ...project, creator }, error: null };
  }
  
  return { data: project, error };
};

export const createProject = async (projectData) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { data: null, error: { message: 'Tizimga kirish kerak' } };
  }
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert([{
      ...projectData,
      creator_id: user.id
    }])
    .select()
    .single();
  
  if (error) return { data: null, error };
  
  if (project && project.creator_id) {
    const { data: creator } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, telegram_username')
      .eq('id', project.creator_id)
      .single();
    
    return { data: { ...project, creator }, error: null };
  }
  
  return { data: project, error };
};

export const updateProject = async (projectId, updates) => {
  const { data: project, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();
  
  if (error) return { data: null, error };
  
  if (project && project.creator_id) {
    const { data: creator } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url, telegram_username')
      .eq('id', project.creator_id)
      .single();
    
    return { data: { ...project, creator }, error: null };
  }
  
  return { data: project, error };
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
    .maybeSingle();
  
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
  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });
  
  if (error) return { data: null, error };
  
  // Har bir comment uchun user ma'lumotlarini olamiz
  if (comments && comments.length > 0) {
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        if (comment.user_id) {
          const { data: user } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url, email')
            .eq('id', comment.user_id)
            .single();
          
          return { ...comment, user };
        }
        return comment;
      })
    );
    
    return { data: commentsWithUsers, error: null };
  }
  
  return { data: comments, error };
};

export const createComment = async (projectId, content) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return { data: null, error: { message: 'Comment yozish uchun tizimga kirish kerak' } };
  }
  
  const { data: comment, error } = await supabase
    .from('comments')
    .insert([{
      user_id: user.id,
      project_id: projectId,
      content
    }])
    .select()
    .single();
  
  if (error) return { data: null, error };
  
  // User ma'lumotlarini qo'shamiz
  if (comment && comment.user_id) {
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email')
      .eq('id', comment.user_id)
      .single();
    
    return { data: { ...comment, user: userData }, error: null };
  }
  
  return { data: comment, error };
};

export const deleteComment = async (commentId) => {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);
  
  return { error };
};

export const updateComment = async (commentId, content) => {
  const { data: comment, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .select()
    .single();
  
  if (error) return { data: null, error };
  
  if (comment && comment.user_id) {
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, email')
      .eq('id', comment.user_id)
      .single();
    
    return { data: { ...comment, user: userData }, error: null };
  }
  
  return { data: comment, error };
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
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .overlaps('required_skills', userProfile.skills)
    .neq('creator_id', userId)
    .eq('status', 'active')
    .order('votes_count', { ascending: false })
    .limit(10);
  
  if (error) return { data: null, error };
  
  // Creator ma'lumotlarini qo'shamiz
  if (projects && projects.length > 0) {
    const projectsWithCreators = await Promise.all(
      projects.map(async (project) => {
        if (project.creator_id) {
          const { data: creator } = await supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, telegram_username')
            .eq('id', project.creator_id)
            .single();
          
          return { ...project, creator };
        }
        return project;
      })
    );
    
    return { data: projectsWithCreators, error: null };
  }
  
  return { data: projects, error };
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