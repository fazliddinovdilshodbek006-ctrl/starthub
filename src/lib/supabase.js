// ./lib/database.js ichidagi getProjects funksiyasi

// AVVAL: (xato versiya)
export const getProjects = async ({ limit = 50 }) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*, profiles!owner_id(username, full_name)')  // XATO: profiles jadvali yo'q
    .order('created_at.desc')  // XATO: noto'g'ri sintaksis
    .limit(limit);
  
  return { data, error };
};

// KEYIN: (to'g'ri versiya)
export const getProjects = async ({ limit = 50 }) => {
  try {
    const { data, error } = await supabase
      .from('public_projects')  // ✅ TO'G'RI: jadval nomi
      .select('*')              // ✅ TO'G'RI: faqat asosiy ustunlar
      .order('created_at', { ascending: false })  // ✅ TO'G'RI: obyekt bilan
      .limit(limit);
    
    return { data, error };
  } catch (err) {
    console.error('getProjects xatosi:', err);
    return { data: null, error: err };
  }
};