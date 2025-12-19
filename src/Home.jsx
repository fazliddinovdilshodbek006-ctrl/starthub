import { useState, useEffect } from "react";
import { Plus, Search, Users, TrendingUp, MessageCircle, Sparkles, Target, Rocket, Github, X } from "lucide-react";
import { getProjects, createProject, signInWithGitHub, signOut, getCurrentUser } from "./database"; // ⚠️ O'ZGARTIRISH: "../lib/database" -> "./database"
import "./App.css";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
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

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      console.log('🚀 Dastur yuklanmoqda...');
      
      // 1. Foydalanuvchini tekshirish
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      // 2. Loyihalarni yuklash (parametrsiz chaqirish) ⚠️ O'ZGARTIRISH
      const supabaseProjects = await getProjects(); // { limit: 50 } PARAMETRINI O'CHIRING
      
      if (supabaseProjects && supabaseProjects.length > 0) {
        console.log('✅ Supabase dan', supabaseProjects.length, 'ta loyiha yuklandi');
        setProjects(supabaseProjects);
        
        // LocalStorage ga ham saqlaymiz (fallback uchun)
        localStorage.setItem('sherik_top_projects', JSON.stringify(supabaseProjects));
      } else {
        // Agar Supabase'dan olmasa, localStorage dan olamiz
        console.log('ℹ️ Supabase dan ma\'lumot olinmadi, localStorage tekshirilmoqda');
        const savedProjects = localStorage.getItem('sherik_top_projects');
        if (savedProjects) {
          try {
            const parsedProjects = JSON.parse(savedProjects);
            console.log('✅ LocalStorage dan', parsedProjects.length, 'ta loyiha yuklandi');
            setProjects(parsedProjects);
          } catch (e) {
            console.error('❌ LocalStorage ma\'lumotlari xato:', e);
          }
        }
      }
    } catch (error) {
      console.error('❌ Dastur yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

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
        looking_for: newProject.looking_for ? [newProject.looking_for] : [],
        stage: newProject.stage,
        telegram: newProject.telegram.replace('@', ''), // @ belgisini olib tashlaymiz
        author: newProject.author,
        votes: 0
      };

      console.log('📤 Supabase ga loyiha yuborilmoqda...');
      
      // createProject funksiyasini chaqiramiz
      const result = await createProject(projectData);
      
      if (!result) {
        console.error('❌ Loyiha yaratib bo\'lmadi');
        alert('Loyiha yaratib bo\'lmadi. LocalStorage ga saqlanadi.');
        return;
      }
      
      // result allaqachon bitta obyekt (array emas) ⚠️ O'ZGARTIRISH
      console.log('✅ Yangi loyiha:', result);
      
      // State ni yangilash
      setProjects(prev => [result, ...prev]);
      
      // Foydalanuvchiga xabar
      alert('🎉 Loyihangiz muvaffaqiyatli yaratildi!');
      
      // Formani tozalash
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
      
    } catch (error) {
      console.error('❌ Loyiha yaratishda xatolik:', error);
      alert('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
  };

  const handleVote = async (projectId) => {
    try {
      const updatedProjects = projects.map(p => {
        if (p.id === projectId) {
          return { ...p, votes: (p.votes || 0) + 1 };
        }
        return p;
      });
      
      const sortedProjects = updatedProjects.sort((a, b) => (b.votes || 0) - (a.votes || 0));
      setProjects(sortedProjects);
      localStorage.setItem('sherik_top_projects', JSON.stringify(sortedProjects));
      
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject({ ...selectedProject, votes: (selectedProject.votes || 0) + 1 });
      }
    } catch (error) {
      console.error('❌ Ovoz berishda xatolik:', error);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Target className="text-white" size={36} />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Sherik Top
          </h1>
          <p className="text-gray-600">Platforma yuklanmoqda...</p>
          <p className="text-sm text-gray-500 mt-4">Supabase bilan ulanish tekshirilmoqda</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-bounce">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-sm font-semibold">
              {user ? 'Sherik topishni boshlang!' : 'O\'zbekistonning Eng Yirik Sheriklar Platformasi'}
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            G'oyangiz Bor?<br />
            <span className="text-yellow-300">Sherik Topamiz!</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto font-medium">
            {user 
              ? 'Endi sizning loyihalaringiz barchaga ko\'rinadi!'
              : 'Yoshlar o\'rtasida hamkorlik va tadbirkorlikni rivojlantirish uchun platforma'
            }
          </p>
          
          <div className="flex justify-center gap-12 mt-12">
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-black mb-2">{projects.length}</div>
              <div className="text-sm opacity-90 font-medium">Faol Loyihalar</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-black mb-2">
                {projects.reduce((sum, p) => sum + (Number(p.votes) || 0), 0)}
              </div>
              <div className="text-sm opacity-90 font-medium">Ovozlar</div>
            </div>
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-5xl font-black mb-2">{user ? 'Online' : '500+'}</div>
              <div className="text-sm opacity-90 font-medium">{user ? 'Siz' : 'Sheriklar'}</div>
            </div>
          </div>

          {/* User Info va Loyiha Yaratish Tugmasi */}
          <div className="flex items-center justify-center gap-4 mt-12">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {user.email?.split('@')[0] || 'Foydalanuvchi'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span className="hidden sm:inline">Chiqish</span>
                  <TrendingUp size={18} className="rotate-90" />
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
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Plus size={22} className="animate-pulse" />
              <span className="hidden sm:inline">Loyiha Yaratish</span>
              <span className="sm:hidden">Yaratish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-10 border border-indigo-100">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <div className="text-8xl mb-6 animate-bounce">🚀</div>
              <h3 className="text-3xl font-black text-gray-800 mb-4">Hali loyihalar yo'q</h3>
              <p className="text-gray-600 text-lg mb-8">
                {user 
                  ? 'Birinchi bo\'lib o\'z loyihangizni yarating!'
                  : 'Birinchi bo\'lib o\'z loyihangizni yarating va sherik toping!'
                }
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
              >
                <Rocket size={24} />
                Loyiha Yaratish
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200 cursor-pointer"
                onClick={() => handleProjectClick(project)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold">
                        {project.category}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold">
                        {project.stage}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote(project.id);
                      }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all transform hover:scale-110 font-bold"
                    >
                      <TrendingUp size={18} />
                      {project.votes || 0}
                    </button>
                  </div>

                  <h3 className="text-2xl font-black text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">{project.description}</p>

                  {project.looking_for && project.looking_for.length > 0 && (
                    <div className="flex items-center gap-2 mb-5 bg-blue-50 p-3 rounded-lg">
                      <Users size={18} className="text-blue-600" />
                      <span className="text-sm text-blue-900 font-semibold">
                        Izlayapti: {Array.isArray(project.looking_for) ? project.looking_for.join(', ') : project.looking_for}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                        {project.author?.[0]?.toUpperCase() || 'A'}
                      </div>
                      <span className="text-sm text-gray-800 font-bold">{project.author || 'Anonim'}</span>
                    </div>
                    <a
                      href={`https://t.me/${project.telegram?.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-sm font-bold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MessageCircle size={16} />
                      Bog'lanish
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <h2 className="text-3xl font-black text-gray-900">Yangi Loyiha Yaratish</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Sizning Ismingiz *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Alisher"
                    value={newProject.author}
                    onChange={(e) => setNewProject({...newProject, author: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Loyiha Nomi *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: O'quv platformasi yoshlar uchun"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Tavsif *
                  </label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Kategoriya
                    </label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Bosqich
                    </label>
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
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Kimlarni Izlayapsiz?
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Dasturchi, Dizayner, Marketing mutaxassis"
                    value={newProject.looking_for}
                    onChange={(e) => setNewProject({...newProject, looking_for: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Telegram Username *
                  </label>
                  <input
                    type="text"
                    placeholder="@username (faqat username, @ belgisiz)"
                    value={newProject.telegram}
                    onChange={(e) => setNewProject({...newProject, telegram: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all font-medium"
                  />
                  <p className="text-xs text-gray-500 mt-1">Faqat username, masalan: alisher_dev</p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all text-lg"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold hover:shadow-2xl transition-all transform hover:scale-105 text-lg"
                >
                  Yaratish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetailModal && selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="text-white" size={24} />
                  </div>
                  <h2 className="text-3xl font-black text-gray-900">{selectedProject.title}</h2>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl p-2"
                >
                  <X size={28} />
                </button>
              </div>

              {/* Categories & Stage */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-bold">
                  {selectedProject.category}
                </span>
                <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full font-bold">
                  {selectedProject.stage}
                </span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-bold">
                  Ovozlar: {selectedProject.votes || 0}
                </span>
                {selectedProject.created_at && (
                  <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-bold">
                    {new Date(selectedProject.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                )}
              </div>

              {/* Full Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-700 mb-3">Loyiha haqida batafsil:</h3>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Looking For */}
              {selectedProject.looking_for && selectedProject.looking_for.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-700 mb-3">Izlayapti:</h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(selectedProject.looking_for) 
                      ? selectedProject.looking_for.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
                            {skill}
                          </span>
                        ))
                      : <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-medium">
                          {selectedProject.looking_for}
                        </span>
                    }
                  </div>
                </div>
              )}

              {/* Author Info */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {selectedProject.author?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{selectedProject.author || 'Anonim'}</div>
                      {selectedProject.telegram && (
                        <div className="text-sm text-gray-600">
                          Telegram: @{selectedProject.telegram.replace('@', '')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Button */}
                  {selectedProject.telegram && (
                    <a
                      href={`https://t.me/${selectedProject.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 font-bold flex items-center gap-2"
                    >
                      <MessageCircle size={20} />
                      Telegram orqali bog'lanish
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    handleVote(selectedProject.id);
                  }}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <TrendingUp size={20} />
                  Ovoz berish ({selectedProject.votes || 0})
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-all"
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
            <h3 className="text-3xl font-black">Sherik Top</h3>
          </div>
          <p className="text-indigo-200 text-lg mb-2">
            🚀 {user ? 'Supabase bilan kuchaytirilgan' : 'O\'zbekistonning Eng Yirik'} Sheriklar Topish Platformasi
          </p>
          <p className="text-indigo-300 text-sm">
            {user 
              ? 'Loyihalaringiz endi Supabase da saqlanadi!'
              : 'G\'oyangiz bor? Sherik kerakmi? Biz bilan boshlang!'
            }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;