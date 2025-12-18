// lib/database.js - TO'G'RI KOD
export const getProjects = async () => {
  console.log('getProjects called');
  return [
    { id: 1, name: 'React Proyekt', description: 'React bilan veb-ilova' },
    { id: 2, name: 'Node.js API', description: 'Node.js backend API' },
    { id: 3, name: 'Vue.js Dashboard', description: 'Vue.js admin paneli' }
  ];
};

export const createProject = async (projectData) => {
  console.log('createProject called with:', projectData);
  return { id: Date.now(), ...projectData };
};

export const signInWithGitHub = async () => {
  console.log('signInWithGitHub called');
  return {
    user: {
      uid: '12345',
      displayName: 'Foydalanuvchi',
      email: 'user@example.com',
      photoURL: 'https://via.placeholder.com/150'
    }
  };
};

export const signOut = async () => {
  console.log('signOut called');
  return Promise.resolve();
};

export const getCurrentUser = async () => {
  console.log('getCurrentUser called');
  return {
    uid: '12345',
    displayName: 'Foydalanuvchi',
    email: 'user@example.com',
    photoURL: 'https://via.placeholder.com/150'
  };
};