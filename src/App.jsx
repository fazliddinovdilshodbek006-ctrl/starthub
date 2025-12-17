import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, TrendingUp, Zap, MessageCircle, Sparkles, Target, Rocket, Github, X, User, Send, Check } from 'lucide-react';
import { getProjects, createProject, signInWithGitHub, signOut, getCurrentUser } from './lib/database';
import './App.css';

// ========== KONSTANTALAR ==========
const SKILLS = [
  'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go',
  'TypeScript', 'JavaScript', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'Flutter', 'React Native', 'PostgreSQL', 'MongoDB', 'Redis',
  'AWS', 'Docker', 'Kubernetes', 'UI/UX Design', 'Figma',
  'Marketing', 'SEO', 'SMM', 'Project Management', 'Data Science',
  'Machine Learning', 'AI', 'Blockchain', 'DevOps', 'QA Testing'
];

const ROLES = [
  { value: 'student', label: 'Talaba' },
  { value: 'developer', label: 'Dasturchi' },
  { value: 'designer', label: 'Dizayner' },
  { value: 'marketer', label: 'Marketolog' },
  { value: 'manager', label: 'Menejer' },
  { value: 'other', label: 'Boshqa' },
];

const LEVELS = [
  { value: 'junior', label: 'Junior' },
  { value: 'middle', label: 'Middle' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

const App = () => {
  const [projects, setProjects] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [user, setUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  
  const categories = [
    { name: 'Hammasi', icon: '🌟', color: 'from-yellow-400 to-orange-400' },
    { name: 'Texnologiya', icon: '💻', color: 'from-blue-400 to-cyan-400' },
    { name: 'Ta\'lim', icon: '📚', color: 'from-green-400 to-emerald-400' },
    { name: 'Sog\'liq', icon: '🏥', color: 'from-red-400 to-pink-400' },
    { name: 'Moliya', icon: '💰', color: 'from-yellow-400 to-amber-400' },
    { name: 'Ijtimoiy', icon: '🤝', color: 'from-purple-400 to-violet-400' },
    { name: 'Boshqa', icon: '🎯', color: 'from-indigo-400 to-blue-400' }
  ];

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Texnologiya',
    looking_for: '',
    stage: 'G\'oya',
    telegram: '',
    author: ''
  });

  const [newProfile, setNewProfile] = useState({
    firstName: '',
    lastName: '',
    telegram: '',
    github: '',
    role: 'developer',
    level: 'junior',
    skills: [],
    bio: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🚀 Dastur yuklanmoqda...');
      
      // Foydalanuvchini tekshirish
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // Profillarni yuklash
      const savedProfiles = localStorage.getItem('sherik_top_profiles');
      if (savedProfiles) {
        const parsedProfiles = JSON.parse(savedProfiles);
        setProfiles(parsedProfiles);
        
        // Joriy foydalanuvchi profilini topish
        if (currentUser) {
          const userProfile = parsedProfiles.find(p => p.odamId === currentUser.id);
          setCurrentProfile(userProfile || null);
        }
      }
      
      // Loyihalarni yuklash
      const { data: supabaseProjects, error } = await getProjects({ limit: 50 });
      
      if (!error && supabaseProjects && supabaseProjects.length > 0) {
        console.log('✅ Supabase dan', supabaseProjects.length, 'ta loyiha yuklandi');
        // Har bir loyihaga votedBy va comments qo'shamiz agar yo'q bo'lsa
        const enrichedProjects = supabaseProjects.map(p => ({
          ...p,
          votedBy: p.votedBy || [],
          comments: p.comments || []
        }));
        setProjects(enrichedProjects);
      } else {
        const savedProjects = localStorage.getItem('sherik_top_projects');
        if (savedProjects) {
          const parsedProjects = JSON.parse(savedProjects);
          const enrichedProjects = parsedProjects.map(p => ({
            ...p,
            votedBy: p.votedBy || [],
            comments: p.comments || []
          }));
          setProjects(enrichedProjects);
        }
      }
    } catch (error) {
      console.error('❌ Dastur yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== PROFIL FUNKSIYALARI ==========
  const handleCreateProfile = () => {
    if (!newProfile.firstName || !newProfile.lastName) {
      alert('Iltimos, ism va familiyangizni kiriting!');
      return;
    }
    if (newProfile.skills.length === 0) {
      alert('Iltimos, kamida bitta ko\'nikma tanlang!');
      return;
    }

    const profile = {
      id: Date.now().toString(),
      odamId: user?.id || Date.now().toString(),
      ...newProfile,
      createdAt: new Date().toISOString()
    };

    const updatedProfiles = [profile, ...profiles];
    setProfiles(updatedProfiles);
    setCurrentProfile(profile);
    localStorage.setItem('sherik_top_profiles', JSON.stringify(updatedProfiles));
    
    setShowProfileModal(false);
    setNewProfile({
      firstName: '',
      lastName: '',
      telegram: '',
      github: '',
      role: 'developer',
      level: 'junior',
      skills: [],
      bio: ''
    });
    
    alert('🎉 Profilingiz muvaffaqiyatli yaratildi!');
  };

  const toggleSkill = (skill) => {
    setNewProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  // ========== LOYIHA FUNKSIYALARI ==========
  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description || !newProject.author || !newProject.telegram) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        looking_for: newProject.looking_for ? newProject.looking_for.split(',').map(s => s.trim()) : [],
        stage: newProject.stage,
        telegram: newProject.telegram,
        author: newProject.author,
        authorId: currentProfile?.id || user?.id || Date.now().toString(),
        votes: 0,
        votedBy: [],
        comments: []
      };

      const { data: createdProject, error } = await createProject(projectData);
      
      let finalProject;
      
      if (error) {
        finalProject = {
          ...projectData,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        
        const existingProjects = JSON.parse(localStorage.getItem('sherik_top_projects') || '[]');
        const updatedProjects = [finalProject, ...existingProjects];
        localStorage.setItem('sherik_top_projects', JSON.stringify(updatedProjects));
      } else {
        finalProject = createdProject[0] || createdProject;
        finalProject.votedBy = [];
        finalProject.comments = [];
      }

      setProjects(prevProjects => [finalProject, ...prevProjects]);
      
      setShowCreateModal(false);
      setNewProject({
        title: '',
        description: '',
        category: 'Texnologiya',
        looking_for: '',
        stage: 'G\'oya',
        telegram: '',
        author: ''
      });
      
      alert('🎉 Loyihangiz muvaffaqiyatli yaratildi!');
    } catch (error) {
      console.error('❌ Loyiha yaratishda xatolik:', error);
      alert('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
  };

  // ========== OVOZ BERISH (BIR KISHI = BIR OVOZ) ==========
  const handleVote = async (projectId) => {
    if (!currentProfile) {
      alert('Ovoz berish uchun avval profil yarating!');
      setShowProfileModal(true);
      return;
    }

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        const votedBy = p.votedBy || [];
        const hasVoted = votedBy.includes(currentProfile.id);
        
        if (hasVoted) {
          // Ovozni olib tashlash
          return {
            ...p,
            votes: Math.max(0, (p.votes || 0) - 1),
            votedBy: votedBy.filter(id => id !== currentProfile.id)
          };
        } else {
          // Ovoz berish
          return {
            ...p,
            votes: (p.votes || 0) + 1,
            votedBy: [...votedBy, currentProfile.id]
          };
        }
      }
      return p;
    });
    
    setProjects(updatedProjects);
    localStorage.setItem('sherik_top_projects', JSON.stringify(updatedProjects));
    
    // Detail modal ni yangilash
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      setSelectedProject(updatedProject);
    }
  };

  // ========== KOMMENT FUNKSIYALARI ==========
  const handleAddComment = (projectId) => {
    if (!currentProfile) {
      alert('Izoh qoldirish uchun avval profil yarating!');
      setShowProfileModal(true);
      return;
    }
    
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      authorId: currentProfile.id,
      authorName: `${currentProfile.firstName} ${currentProfile.lastName}`,
      text: commentText.trim(),
      createdAt: new Date().toISOString()
    };

    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    });
    
    setProjects(updatedProjects);
    localStorage.setItem('sherik_top_projects', JSON.stringify(updatedProjects));
    
    // Detail modal ni yangilash
    if (selectedProject && selectedProject.id === projectId) {
      const updatedProject = updatedProjects.find(p => p.id === projectId);
      setSelectedProject(updatedProject);
    }
    
    setCommentText('');
  };

  // ========== RECOMMENDATION ALGORITMI ==========
  const getRecommendedProfiles = (project) => {
    if (!project.looking_for || project.looking_for.length === 0) return [];
    
    const lookingForSkills = Array.isArray(project.looking_for) 
      ? project.looking_for 
      : project.looking_for.split(',').map(s => s.trim());
    
    return profiles.filter(profile => 
      profile.id !== currentProfile?.id &&
      lookingForSkills.some(looking => 
        profile.skills.some(skill => 
          skill.toLowerCase().includes(looking.toLowerCase()) ||
          looking.toLowerCase().includes(skill.toLowerCase())
        ) ||
        profile.role.toLowerCase().includes(looking.toLowerCase())
      )
    );
  };

  const getRecommendedProjects = () => {
    if (!currentProfile || !currentProfile.skills || currentProfile.skills.length === 0) return [];
    
    return projects.filter(p => 
      p.authorId !== currentProfile.id &&
      p.looking_for && 
      (Array.isArray(p.looking_for) ? p.looking_for : [p.looking_for]).some(looking => 
        currentProfile.skills.some(skill => 
          looking.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(looking.toLowerCase())
        ) ||
        looking.toLowerCase().includes(currentProfile.role)
      )
    );
  };

  const handleLogin = async () => {
    try {
      const { error } = await signInWithGitHub();
      if (error) throw error;
    } catch (error) {
      console.error('❌ Login xatosi:', error);
      alert(`Kirish xatosi: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      setUser(null);
      setCurrentProfile(null);
      alert('👋 Siz tizimdan chiqdingiz');
    } catch (error) {
      console.error('❌ Logout xatosi:', error);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedProjects = getRecommendedProjects();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
            <Rocket className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sherik Top</h2>
          <p>Platforma yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Sherik Top
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {currentProfile ? `${currentProfile.firstName} ${currentProfile.lastName}` : 'Sheriklar Topish Platformasi'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {currentProfile ? (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {currentProfile.firstName[0]}{currentProfile.lastName[0]}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold">{currentProfile.firstName}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentProfile.level}</p>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 hover:border-indigo-300 transition-colors font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profil Yaratish</span>
                </button>
              )}
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Loyiha Yaratish</span>
                <span className="sm:hidden">Yaratish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">
              {currentProfile ? `Xush kelibsiz, ${currentProfile.firstName}!` : "O'zbekistonning Eng Yirik Sheriklar Platformasi"}
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6">
            G'oyangiz Bor?
            <br />
            <span className="text-yellow-300">Sherik Topamiz!</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-12">
            Yoshlar o'rtasida hamkorlik va tadbirkorlikni rivojlantirish uchun platforma
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-white">{projects.length}</p>
              <p className="text-white/70">Faol Loyihalar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-white">
                {projects.reduce((sum, p) => sum + (p.votes || 0), 0)}
              </p>
              <p className="text-white/70">Ovozlar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-white">{profiles.length || '500+'}</p>
              <p className="text-white/70">Sheriklar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Projects for current user */}
      {currentProfile && recommendedProjects.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              Sizga mos loyihalar ({recommendedProjects.length})
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {recommendedProjects.slice(0, 5).map(project => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="min-w-[280px] bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-all"
                >
                  <h4 className="font-bold text-gray-800 mb-1">{project.title}</h4>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-2 text-xs text-indigo-600">
                    <Users className="w-3 h-3" />
                    {Array.isArray(project.looking_for) ? project.looking_for.join(', ') : project.looking_for}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Loyiha yoki g'oya izlash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-lg font-medium"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-6 py-3 rounded-xl whitespace-nowrap font-bold transition-all transform hover:scale-105 ${
                selectedCategory === cat.name
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Rocket className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Hali loyihalar yo'q</h3>
            <p className="text-gray-500 mb-8">Birinchi bo'lib o'z loyihangizni yarating!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Loyiha Yaratish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const hasVoted = currentProfile && project.votedBy?.includes(currentProfile.id);
              
              return (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-indigo-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700">
                        {project.category}
                      </span>
                      <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                        {project.stage}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(project.id);
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-110 ${
                        hasVoted
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-pink-100'
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {project.votes || 0}
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {project.looking_for && (
                    <div className="flex items-center gap-2 mb-4 text-sm">
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span className="text-gray-500">
                        Izlayapti: <span className="text-gray-800 font-medium">
                          {Array.isArray(project.looking_for) ? project.looking_for.join(', ') : project.looking_for}
                        </span>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {project.author?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{project.author || 'Anonim'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <MessageCircle className="w-4 h-4" />
                      {project.comments?.length || 0}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Yangi Loyiha Yaratish</h2>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Sizning Ismingiz *</label>
                <input
                  type="text"
                  placeholder="Ismingizni kiriting"
                  value={newProject.author}
                  onChange={(e) => setNewProject({...newProject, author: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Loyiha Nomi *</label>
                <input
                  type="text"
                  placeholder="Loyihangiz nomini kiriting"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tavsif *</label>
                <textarea
                  placeholder="Loyihangiz haqida batafsil yozing..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategoriya</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                  >
                    <option>Texnologiya</option>
                    <option>Ta'lim</option>
                    <option>Sog'liq</option>
                    <option>Moliya</option>
                    <option>Ijtimoiy</option>
                    <option>Boshqa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bosqich</label>
                  <select
                    value={newProject.stage}
                    onChange={(e) => setNewProject({...newProject, stage: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                  >
                    <option>G'oya</option>
                    <option>MVP</option>
                    <option>Rivojlantirish</option>
                    <option>Tayyor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kimlarni Izlayapsiz?</label>
                <input
                  type="text"
                  placeholder="Masalan: Dasturchi, Dizayner, Marketolog"
                  value={newProject.looking_for}
                  onChange={(e) => setNewProject({...newProject, looking_for: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                />
                <p className="text-xs text-gray-500 mt-1">Vergul bilan ajrating</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Telegram Username *</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={newProject.telegram}
                  onChange={(e) => setNewProject({...newProject, telegram: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                Yaratish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">
                  {currentProfile ? 'Mening Profilim' : 'Profil Yaratish'}
                </h2>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {currentProfile ? (
                // Profil ko'rinishi
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {currentProfile.firstName[0]}{currentProfile.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{currentProfile.firstName} {currentProfile.lastName}</h3>
                      <p className="text-gray-600 capitalize">{ROLES.find(r => r.value === currentProfile.role)?.label} • {currentProfile.level}</p>
                    </div>
                  </div>

                  {currentProfile.bio && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Haqida</h4>
                      <p className="text-gray-600">{currentProfile.bio}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-2">Ko'nikmalar</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentProfile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 rounded-lg text-sm font-medium bg-indigo-100 text-indigo-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {currentProfile.telegram && (
                      <a
                        href={`https://t.me/${currentProfile.telegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        @{currentProfile.telegram}
                      </a>
                    )}
                    {currentProfile.github && (
                      <a
                        href={`https://github.com/${currentProfile.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                        {currentProfile.github}
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setCurrentProfile(null);
                      const updatedProfiles = profiles.filter(p => p.id !== currentProfile.id);
                      setProfiles(updatedProfiles);
                      localStorage.setItem('sherik_top_profiles', JSON.stringify(updatedProfiles));
                      setShowProfileModal(false);
                    }}
                    className="w-full py-3 text-red-500 hover:bg-red-50 rounded-xl font-semibold transition-colors"
                  >
                    Profilni O'chirish
                  </button>
                </div>
              ) : (
                // Profil yaratish formasi
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Ism *</label>
                      <input
                        type="text"
                        placeholder="Ismingiz"
                        value={newProfile.firstName}
                        onChange={(e) => setNewProfile({...newProfile, firstName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Familiya *</label>
                      <input
                        type="text"
                        placeholder="Familiyangiz"
                        value={newProfile.lastName}
                        onChange={(e) => setNewProfile({...newProfile, lastName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Telegram</label>
                      <input
                        type="text"
                        placeholder="@username"
                        value={newProfile.telegram}
                        onChange={(e) => setNewProfile({...newProfile, telegram: e.target.value.replace('@', '')})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">GitHub</label>
                      <input
                        type="text"
                        placeholder="username"
                        value={newProfile.github}
                        onChange={(e) => setNewProfile({...newProfile, github: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kim siz?</label>
                      <select
                        value={newProfile.role}
                        onChange={(e) => setNewProfile({...newProfile, role: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                      >
                        {ROLES.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Daraja</label>
                      <select
                        value={newProfile.level}
                        onChange={(e) => setNewProfile({...newProfile, level: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                      >
                        {LEVELS.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ko'nikmalar * <span className="text-gray-500 font-normal">({newProfile.skills.length} tanlangan)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 rounded-xl border-2 border-gray-200">
                      {SKILLS.map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            newProfile.skills.includes(skill)
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {newProfile.skills.includes(skill) && <Check className="w-3 h-3 inline mr-1" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">O'zingiz haqida</label>
                    <textarea
                      placeholder="Qisqacha o'zingiz haqida yozing..."
                      value={newProfile.bio}
                      onChange={(e) => setNewProfile({...newProfile, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                </>
              )}
            </div>

            {!currentProfile && (
              <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCreateProfile}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl"
                >
                  Yaratish
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold truncate">{selectedProject.title}</h2>
              </div>
              <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-100 text-indigo-700">
                  {selectedProject.category}
                </span>
                <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-green-100 text-green-700">
                  {selectedProject.stage}
                </span>
                {selectedProject.created_at && (
                  <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700">
                    {new Date(selectedProject.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Loyiha haqida</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedProject.description}</p>
              </div>

              {/* Looking For */}
              {selectedProject.looking_for && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    Izlayapti
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(selectedProject.looking_for) ? selectedProject.looking_for : [selectedProject.looking_for]).map((skill, index) => (
                      <span key={index} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Profiles */}
              {(() => {
                const recommended = getRecommendedProfiles(selectedProject);
                if (recommended.length === 0) return null;
                
                return (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      Tavsiya etilgan sheriklar
                    </h3>
                    <div className="space-y-2">
                      {recommended.slice(0, 3).map(profile => (
                        <div key={profile.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {profile.firstName[0]}{profile.lastName[0]}
                            </div>
                            <div>
                              <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                              <p className="text-xs text-gray-500 capitalize">{profile.role} • {profile.level}</p>
                            </div>
                          </div>
                          {profile.telegram && (
                            <a
                              href={`https://t.me/${profile.telegram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline text-sm"
                            >
                              @{profile.telegram}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Author */}
              <div className="p-4 rounded-2xl bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-lg font-bold">
                      {selectedProject.author?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedProject.author || 'Anonim'}</p>
                      <p className="text-sm text-gray-500">@{selectedProject.telegram?.replace('@', '')}</p>
                    </div>
                  </div>
                  <a
                    href={`https://t.me/${selectedProject.telegram?.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Bog'lanish
                  </a>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Izohlar ({selectedProject.comments?.length || 0})
                </h3>
                
                {/* Comment Input */}
                {currentProfile ? (
                  <div className="flex gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                      {currentProfile.firstName[0]}{currentProfile.lastName[0]}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <textarea
                        placeholder="Izoh yozing..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        rows={2}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
                      />
                      <button
                        onClick={() => handleAddComment(selectedProject.id)}
                        disabled={!commentText.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl disabled:opacity-50 hover:shadow-lg transition-all"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4 p-3 rounded-xl bg-gray-50">
                    Izoh qoldirish uchun avval profil yarating
                  </p>
                )}

                {/* Comments List */}
                <div className="space-y-3">
                  {(!selectedProject.comments || selectedProject.comments.length === 0) ? (
                    <p className="text-center text-gray-500 py-4">Hali izohlar yo'q</p>
                  ) : (
                    selectedProject.comments.map(comment => (
                      <div key={comment.id} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                          {comment.authorName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex gap-3">
              <button
                onClick={() => handleVote(selectedProject.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold transition-all ${
                  currentProfile && selectedProject.votedBy?.includes(currentProfile.id)
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                    : 'border-2 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                {currentProfile && selectedProject.votedBy?.includes(currentProfile.id) ? 'Ovoz berildi' : 'Ovoz berish'} ({selectedProject.votes || 0})
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-100 border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sherik Top
            </span>
          </div>
          <p className="text-gray-500 mb-2">O'zbekistonning Eng Yirik Sheriklar Topish Platformasi</p>
          <p className="text-sm text-gray-400">G'oyangiz bor? Sherik kerakmi? Biz bilan boshlang!</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
