// Временные заглушки для функций
export const getProjects = async () => {
  console.log('getProjects called');
  return [];
};

export const createProject = async (project) => {
  console.log('createProject called with:', project);
  return { id: Date.now(), ...project };
};

export const signInWithGitHub = async () => {
  console.log('signInWithGitHub called');
  return { user: null };
};

export const signOut = async () => {
  console.log('signOut called');
};

export const getCurrentUser = async () => {
  console.log('getCurrentUser called');
  return null;
};