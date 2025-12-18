import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, TrendingUp, Sparkles, Target, MessageCircle, Github, X, User, Heart, MessageSquare, Send, Trash2, Edit2, Filter } from 'lucide-react';
import {
  getProjects,
  createProject,
  signInWithGitHub,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  getProfile,
  createProfile,
  updateProfile,
  voteProject,
  getUserVotes,
  getComments,
  createComment,
  deleteComment,
  getRecommendedProjects,
  getRecommendedPartners
} from './lib/database';
import './App.css';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [recommendedPartners, setRecommendedPartners] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const categories = [
    { name: 'Hammasi', icon: '🌟', color: 'from-yellow-400 to-orange-400' },
    { name: 'Texnologiya', icon: '💻', color: 'from-blue-400 to-cyan-400' },
    { name: 'Ta\'lim', icon: '📚', color: 'from-green-400 to-emerald-400' },
    { name: 'Sog\'liq', icon: '🏥', color: 'from-red-400 to-pink-400' },
    { name: 'Moliya', icon: '💰', color: 'from-yellow-400 to-amber-400' },
    { name: 'Ijtimoiy', icon: '🤝', color: 'from-purple-400 to-violet-400' },
    { name: 'Boshqa', icon: '🎯', color: 'from-indigo-400 to-blue-400' }
  ];

  const roles = ['Developer', 'Designer', 'Marketer', 'Product Manager', 'Data Scientist', 'Boshqa'];
  const levels = ['Student', 'Junior', 'Middle', 'Senior'];
  const skillsList = ['React', 'Node.js', 'Python', 'JavaScript', 'Figma', 'UI/UX', 'Marketing', 'SEO', 'Data Analysis', 'AI/ML'];

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Texnologiya',
    required_skills: [],
    required_roles: [],
    stage: 'G\'oya',
    team_size: 1
  });

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    telegram_username: '',
    github_url: '',
    bio: '',
    role: 'Developer',
    level: 'Student',
    skills: []
  });

  useEffect(() => {
    loadInitialData();
    
    // Auth state listener
    const { data: authListener } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
        loadProjects();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadUserVotes();
      if (userProfile) {
        loadRecommendedProjects();
      }
    }
  }, [user, userProfile]);

  const loadInitialData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        await loadUserProfile(currentUser.id);
        await loadUserVotes();
      }
      
      await loadProjects();
    } catch (error) {
      console.error('❌ Dastur yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data: profile, error } = await getProfile(userId);
      
      if (error || !profile) {
        // Profil yo'q bo'lsa, yangi profil yaratish modalini ko'rsatish
        setShowProfileModal(true);
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('❌ Profil yuklashda xatolik:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await getProjects();
      if (!error && data) {
        setProjects(data);
      }
    } catch (error) {
      console.error('❌ Loyihalar yuklashda xatolik:', error);
    }
  };

  const loadUserVotes = async () => {
    try {
      const { data } = await getUserVotes();
      setUserVotes(data || []);
    } catch (error) {
      console.error('❌ Ovozlar yuklashda xatolik:', error);
    }
  };

  const loadRecommendedProjects = async () => {
    if (!user) return;
    
    try {
      const { data } = await getRecommendedProjects(user.id);
      setRecommendedProjects(data || []);
    } catch (error) {
      console.error('❌ Tavsiya loyihalar yuklashda xatolik:', error);
    }
  };

  const loadComments = async (projectId) => {
    try {
      const { data } = await getComments(projectId);
      setComments(data || []);
    } catch (error) {
      console.error('❌ Commentlar yuklashda xatolik:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.full_name || !profileForm.telegram_username) {
      alert('Ism va Telegram username majburiy!');
      return;
    }

    try {
      if (userProfile) {
        // Profilni yangilash
        const { data, error } = await updateProfile(user.id, profileForm);
        if (!error && data) {
          setUserProfile(data);
          setShowProfileModal(false);
          alert('✅ Profil yangilandi!');
        }
      } else {
        // Yangi profil yaratish
        const { data, error } = await createProfile({
          id: user.id,
          email: user.email,
          ...profileForm
        });
        
        if (!error && data) {
          setUserProfile(data);
          setShowProfileModal(false);
          alert('✅ Profil yaratildi!');
        }
      }
    } catch (error) {
      console.error('❌ Profil saqlashda xatolik:', error);
      alert('Xatolik yuz berdi!');
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert('Loyiha nomi va tavsifi majburiy!');
      return;
    }

    if (!user) {
      alert('Loyiha yaratish uchun tizimga kirish kerak!');
      return;
    }

    if (!userProfile) {
      alert('Avval profilingizni to\'ldiring!');
      setShowProfileModal(true);
      return;
    }

    try {
      const { data, error } = await createProject(newProject);
      
      if (!error && data) {
        setProjects([data, ...projects]);
        setShowCreateModal(false);
        setNewProject({
          title: '',
          description: '',
          category: 'Texnologiya',
          required_skills: [],
          required_roles: [],
          stage: 'G\'oya',
          team_size: 1
        });
        alert('🎉 Loyiha muvaffaqiyatli yaratildi!');
      } else {
        alert('Xatolik: ' + error.message);
      }
    } catch (error) {
      console.error('❌ Loyiha yaratishda xatolik:', error);
      alert('Xatolik yuz berdi!');
    }
  };

  const handleVote = async (projectId, e) => {
    e?.stopPropagation();
    
    if (!user) {
      alert('Ovoz berish uchun tizimga kirish kerak!');
      return;
    }

    try {
      const { data, error } = await voteProject(projectId);
      
      if (!error) {
        await loadProjects();
        await loadUserVotes();
        
        if (selectedProject && selectedProject.id === projectId) {
          const updatedProject = projects.find(p => p.id === projectId);
          if (updatedProject) {
            setSelectedProject(updatedProject);
          }
        }
      }
    } catch (error) {
      console.error('❌ Ovoz berishda xatolik:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const { data, error } = await createComment(selectedProject.id, newComment);
      
      if (!error && data) {
        setComments([data, ...comments]);
        setNewComment('');
      }
    } catch (error) {
      console.error('❌ Comment qo\'shishda xatolik:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.error('❌ Login xatosi:', error);
      alert('Kirish xatosi: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
      setUserProfile(null);
      alert('👋 Siz tizimdan chiqdingiz');
    } catch (error) {
      console.error('❌ Logout xatosi:', error);
    }
  };

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setShowDetailModal(true);
    await loadComments(project.id);
    
    // Tavsiya sheriklar yuklash
    if (user) {
      try {
        const { data } = await getRecommendedPartners(project.id);
        setRecommendedPartners(data || []);
      } catch (error) {
        console.error('❌ Sheriklar yuklashda xatolik:', error);
      }
    }
  };

  const toggleSkill = (skill, isProject = false) => {
    if (isProject) {
      const skills = newProject.required_skills.includes(skill)
        ? newProject.required_skills.filter(s => s !== skill)
        : [...newProject.required_skills, skill];
      setNewProject({ ...newProject, required_skills: skills });
    } else {
      const skills = profileForm.skills.includes(skill)
        ? profileForm.skills.filter(s => s !== skill)
        : [...profileForm.skills, skill];
      setProfileForm({ ...profileForm, skills });
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Target className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            StartHub
          </h1>
          <p className="text-gray-600">Platforma yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.location.reload()}>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <Target className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  StartHub
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  {userProfile ? `Salom, ${userProfile.full_name}!` : 'Sheriklar Topish Platformasi'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (userProfile) {
                        setProfileForm(userProfile);
                      }
                      setShowProfileModal(true);
                    }}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                  >
                    <User size={18} />
                    Profil
                  </button>
                  
                  {userProfile && recommendedProjects.length > 0 && (
                    <button
                      onClick={() => setShowRecommendations(!showRecommendations)}
                      className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      <Sparkles size={18} />
                      Sizga Mos
                    </button>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Chiqish</span>
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Github size={18} />
                  <span className="hidden sm:inline">Kirish</span>
                </button>
              )}
              
              <button
                onClick={() => {
                  if (!user) {
                    alert('Loyiha yaratish uchun tizimga kirish kerak!');
                    return;
                  }
                  if (!userProfile) {
                    alert('Avval profilingizni to\'ldiring!');
                    setShowProfileModal(true);
                    return;
                  }
                  setShowCreateModal(true);
                }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Plus size={22} className="animate-pulse" />
                <span className="hidden sm:inline">Loyiha Yaratish</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-sm font-semibold">
              {userProfile ? `${userProfile.role} · ${userProfile.level}` : 'O\'zbekistonning Sheriklar Platformasi'}
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            G'oyangiz Bor? Sherik Topamiz!
          </h2>
          
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            {userProfile 
              ? 'Smart algoritm sizga mos loyihalar va sheriklar tavsiya qiladi'
              : 'Yoshlar o\'rtasida hamkorlik va tadbirkorlikni rivojlantirish'
            }
          </p>
          
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-black mb-1">{projects.length}</div>
              <div className="text-sm opacity-90">Loyihalar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-1">
                {projects.reduce((sum, p) => sum + (p.votes_count || 0), 0)}
              </div>
              <div className="text-sm opacity-90">Ovozlar</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black mb-1">{userProfile ? recommendedProjects.length : '500+'}</div>
              <div className="text-sm opacity-90">{userProfile ? 'Sizga Mos' : 'Sheriklar'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Banner */}
      {showRecommendations && userProfile && recommendedProjects.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Sparkles size={28} />
                <div>
                  <h3 className="text-2xl font-black">Sizga Mos Loyihalar</h3>
                  <p className="text-sm opacity-90">Sizning skilllaringizga asoslangan tavsiyalar</p>
                </div>
              </div>
              <button onClick={() => setShowRecommendations(false)} className="p-2 hover:bg-white/20 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedProjects.slice(0, 3).map(project => (
                <div 
                  key={project.id}
                  onClick={() => handleProjectClick(project)}
                  className="bg-white/10 backdrop-blur-sm p-4 rounded-xl cursor-pointer hover:bg-white/20 transition-all"
                >
                  <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                  <p className="text-sm opacity-90 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {project.required_skills?.slice(0, 3).map((skill, i) => (
                      <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-4 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
              <input
                type="text"
                placeholder="Loyiha yoki g'oya izlash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-indigo-100 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-lg font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-5 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all transform hover:scale-105 ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-8xl mb-6">🚀</div>
              <h3 className="text-3xl font-black text-gray-800 mb-4">Hali loyihalar yo'q</h3>
              <p className="text-gray-600 text-lg mb-8">Birinchi bo'lib o'z loyihangizni yarating!</p>
            </div>
          ) : (
            filteredProjects.map((project) => {
              const isVoted = userVotes.includes(project.id);
              
              return (
                <div 
                  key={project.id} 
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200 cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold">
                          {project.category}
                        </span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold">
                          {project.stage}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleVote(project.id, e)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl hover:shadow-lg transition-all transform hover:scale-110 font-bold ${
                          isVoted 
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Heart size={18} fill={isVoted ? 'currentColor' : 'none'} />
                        {project.votes_count || 0}
                      </button>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                    {project.required_skills && project.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.required_skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                            {skill}
                          </span>
                        ))}
                        {project.required_skills.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                            +{project.required_skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-black text-sm">
                          {project.creator?.full_name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <span className="text-sm text-gray-800 font-bold">
                          {project.creator?.full_name || 'Anonim'}
                        </span>
                      </div>
                      {project.creator?.telegram_username && (
                        <a
                          href={`https://t.me/${project.creator.telegram_username.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={20} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">
                  {userProfile ? 'Profilni Tahrirlash' : 'Profil Yaratish'}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ism Familya *</label>
                  <input
                    type="text"
                    placeholder="To'liq ismingiz"
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kasb/Yo'nalish *</label>
                    <select
                      value={profileForm.role}
                      onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    >
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Daraja *</label>
                    <select
                      value={profileForm.level}
                      onChange={(e) => setProfileForm({...profileForm, level: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    >
                      {levels.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Skills *</label>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl font-bold transition-all ${
                          profileForm.skills.includes(skill)
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Telegram Username *</label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={profileForm.telegram_username}
                    onChange={(e) => setProfileForm({...profileForm, telegram_username: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">GitHub URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username"
                    value={profileForm.github_url}
                    onChange={(e) => setProfileForm({...profileForm, github_url: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
                  <textarea
                    placeholder="O'zingiz haqingizda qisqacha..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Yangi Loyiha</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Loyiha Nomi *</label>
                  <input
                    type="text"
                    placeholder="Loyihangiz nomi"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tavsif *</label>
                  <textarea
                    placeholder="Loyihangiz haqida batafsil..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Kategoriya</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    >
                      {categories.slice(1).map(cat => <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Bosqich</label>
                    <select
                      value={newProject.stage}
                      onChange={(e) => setNewProject({...newProject, stage: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    >
                      <option>G'oya</option>
                      <option>MVP</option>
                      <option>Rivojlantirish</option>
                      <option>Tayyor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kerakli Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill, true)}
                        className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                          newProject.required_skills.includes(skill)
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jamoa hajmi</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newProject.team_size}
                    onChange={(e) => setNewProject({...newProject, team_size: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transition-all"
                >
                  Yaratish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-black text-gray-900">{selectedProject.title}</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-700 p-2"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold">
                  {selectedProject.category}
                </span>
                <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold">
                  {selectedProject.stage}
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                  <Heart size={14} /> {selectedProject.votes_count || 0} ovoz
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-3">Loyiha haqida:</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">{selectedProject.description}</p>
                </div>
              </div>

              {selectedProject.required_skills && selectedProject.required_skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Kerakli Skills:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.required_skills.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {recommendedPartners.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-3">🎯 Tavsiya Sheriklar:</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {recommendedPartners.slice(0, 4).map(partner => (
                      <div key={partner.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-black text-sm">
                            {partner.full_name?.[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-sm">{partner.full_name}</div>
                            <div className="text-xs text-gray-600">{partner.role} · {partner.level}</div>
                          </div>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {partner.skills?.slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-black">
                      {selectedProject.creator?.full_name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{selectedProject.creator?.full_name || 'Anonim'}</div>
                      {selectedProject.creator?.telegram_username && (
                        <div className="text-sm text-gray-600">@{selectedProject.creator.telegram_username.replace('@', '')}</div>
                      )}
                    </div>
                  </div>
                  
                  {selectedProject.creator?.telegram_username && (
                    <a
                      href={`https://t.me/${selectedProject.creator.telegram_username.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg transition-all font-bold flex items-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Bog'lanish
                    </a>
                  )}
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Izohlar ({comments.length})
                </h3>

                {user && (
                  <div className="mb-4 flex gap-2">
                    <input
                      type="text"
                      placeholder="Izoh qoldiring..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-black text-xs flex-shrink-0">
                          {comment.user?.full_name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm">{comment.user?.full_name || 'Anonim'}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Hali izoh yo'q. Birinchi bo'ling!</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={(e) => handleVote(selectedProject.id)}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                    userVotes.includes(selectedProject.id)
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={userVotes.includes(selectedProject.id) ? 'currentColor' : 'none'} />
                  Ovoz berish
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target size={32} className="text-indigo-300" />
            <h3 className="text-3xl font-black">StartHub</h3>
          </div>
          <p className="text-indigo-200 text-lg mb-2">
            🚀 {userProfile ? 'Smart AI bilan ishlaydigan' : 'O\'zbekistonning'} Sheriklar Topish Platformasi
          </p>
          <p className="text-indigo-300 text-sm">
            G'oyangiz bor? Sherik kerakmi? Biz bilan boshlang!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;