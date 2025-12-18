// src/lib/database.js - getProjects funksiyasini o'zgartiring

export const getProjects = async (filters = {}) => {
  let query = supabase
    .from('projects')
    .select('*');  // Avval faqat projectlarni olamiz
  
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
  
  // Keyin har bir project uchun creator ma'lumotlarini alohida olamiz
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

// getProject funksiyasini ham o'zgartiramiz
export const getProject = async (projectId) => {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error) return { data: null, error };
  
  // Creator ma'lumotlarini alohida olamiz
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

// createProject funksiyasida ham
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
  
  // Creator ma'lumotlarini qo'shamiz
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

// updateProject ham
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