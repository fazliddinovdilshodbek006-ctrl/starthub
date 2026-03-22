// src/pages/Home.jsx - ✅ 406 XATO HAL QILINDI
import { useState, useEffect } from "react";
import { CheckCircle, X, Search, Instagram, Facebook, MessageCircle } from "lucide-react";
import { getProjects, createProject, getCurrentUser } from "../lib/database";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabase";
import logoImage from "../assets/logo.png";
import "../App.css";

import HeroSection from "../components/home/HeroSection";
import ProjectCard from "../components/home/ProjectCard";
import CreateModal from "../components/home/CreateModal";
import DetailModal from "../components/home/DetailModal";
import AIChat from "../components/home/AIChat";
import AboutSection from "../components/home/AboutSection";

const Home = () => {
  const { theme } = useTheme();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', content: 'Salom! Men Sherik Top platformasining AI yordamchisiman. Sizga qanday yordam bera olaman?' }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const [otpVerifiedEmail, setOtpVerifiedEmail] = useState('');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'Texnologiya',
    looking_for: '',
    stage: "G'oya",
    image: null,
    imagePreview: null
  });

  const categories = [
    { name: 'Hammasi', icon: '🌐', color: 'from-slate-600 to-slate-800' },
    { name: 'Texnologiya', icon: '💻', color: 'from-blue-500 to-blue-700' },
    { name: "Ta'lim", icon: '📚', color: 'from-green-500 to-green-700' },
    { name: "Sog'liq", icon: '🏥', color: 'from-red-500 to-red-700' },
    { name: 'Moliya', icon: '💼', color: 'from-yellow-500 to-yellow-700' },
    { name: 'Ijtimoiy', icon: '🤝', color: 'from-purple-500 to-purple-700' },
    { name: 'Boshqa', icon: '🎯', color: 'from-indigo-500 to-indigo-700' }
  ];

  // ===== DATA YUKLASH - ✅ PROFILES SELECT YO'Q =====
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [currentUser, savedEmail] = await Promise.all([
          getCurrentUser(),
          Promise.resolve(localStorage.getItem("sherik_top_otp_email"))
        ]);

        setUser(currentUser);
        if (savedEmail) setOtpVerifiedEmail(savedEmail);

        // ✅ Profiles SELECT qilinmaydi - 406 xato yo'qoladi
        if (currentUser) {
          console.log('✅ User login:', currentUser.email);
          
          // ✅ Fake profile - auth.user dan ma'lumot
          setProfile({
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0],
            email: currentUser.email,
            telegram: currentUser.user_metadata?.phone || '',
            user_type: 'asoschi'
          });
        }

        // ✅ Projectlarni yuklash
        const projectsData = await getProjects();
        if (projectsData?.length > 0) setProjects(projectsData);

      } catch (err) {
        console.error('❌ Yuklashda xatolik:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleOpen = () => setShowCreateModal(true);
    window.addEventListener('openCreateModal', handleOpen);
    return () => window.removeEventListener('openCreateModal', handleOpen);
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewProject({ ...newProject, image: file, imagePreview: URL.createObjectURL(file) });
  };

  const uploadImage = async (file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `project-images/${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('projects').upload(filePath, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('projects').getPublicUrl(filePath);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Rasm yuklashda xatolik:', err);
      return null;
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.description) {
      alert('Iltimos, loyiha nomi va tavsifni kiriting!');
      return;
    }
    if (!user) {
      alert("Loyiha yaratish uchun login qiling!");
      return;
    }
    
    try {
      const imageUrl = newProject.image ? await uploadImage(newProject.image) : null;
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        category: newProject.category,
        looking_for: newProject.looking_for ? [newProject.looking_for] : [],
        stage: newProject.stage,
        author: profile?.full_name || user.email.split('@')[0],
        telegram: profile?.telegram || user.user_metadata?.phone || '',
        image_url: imageUrl,
        user_id: user.id,
        votes: 0
      };
      
      const result = await createProject(projectData);
      if (!result) { alert("Loyiha yaratib bo'lmadi."); return; }
      
      setProjects(prev => [result, ...prev]);
      alert('🎉 Loyihangiz muvaffaqiyatli yaratildi!');
      setShowCreateModal(false);
      setNewProject({ title: '', description: '', category: 'Texnologiya', looking_for: '', stage: "G'oya", image: null, imagePreview: null });
    } catch (err) {
      console.error('❌ Loyiha yaratishda xatolik:', err);
      alert('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.');
    }
  };

  const handleVote = (projectId) => {
    setProjects(prev =>
      prev.map(p => p.id === projectId ? { ...p, votes: (p.votes || 0) + 1 } : p)
         .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    );
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => ({ ...prev, votes: (prev.votes || 0) + 1 }));
    }
  };

  const sanitizeInput = (input) => {
    const dangerous = ['ignore previous', 'forget instructions', 'disregard', '<script>', '</script>', 'javascript:', 'onerror=', 'eval(', 'exec(', '__import__', 'os.system'];
    const cleaned = input.toLowerCase();
    for (const term of dangerous) {
      if (cleaned.includes(term)) return null;
    }
    return input.trim().substring(0, 500);
  };

  const sendAIMessage = async () => {
    if (!aiInput.trim() || aiLoading) return;
    const sanitized = sanitizeInput(aiInput);
    if (!sanitized) {
      setAiMessages(prev => [...prev, { role: 'assistant', content: "Kechirasiz, bu so'rov qabul qilinmadi." }]);
      setAiInput('');
      return;
    }
    setAiMessages(prev => [...prev, { role: 'user', content: sanitized }]);
    setAiInput('');
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { message: sanitized, history: aiMessages.slice(-6) },
      });
      if (error) throw error;
      const reply = data?.text || "Javob ololmadim, qayta urinib ko'ring 🙏";
      setAiMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      console.error('AI chat error:', err);
      setAiMessages(prev => [...prev, { role: 'assistant', content: "Hozir texnik muammo bor. Bir oz kutib qayta urinib ko'ring! 🙏" }]);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="relative mb-6 w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full animate-ping opacity-75"></div>
            <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logoImage} alt="Sherik Top" className="w-10 h-10 rounded-xl" />
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Sherik<span className="text-blue-600">Top</span>
            </h1>
          </div>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Platforma yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>

      {showWelcomeMessage && otpVerifiedEmail && (
        <div className="fixed top-24 right-4 z-40 max-w-md">
          <div className={`${theme === 'dark' ? 'bg-green-900/90 border-green-700' : 'bg-green-50 border-green-200'} border rounded-2xl px-6 py-4 shadow-2xl backdrop-blur-lg`}>
            <div className="flex items-center gap-4">
              <CheckCircle className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <div className="flex-1">
                <p className={`font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Xush kelibsiz!</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{otpVerifiedEmail} tasdiqlandi</p>
              </div>
              <button onClick={() => setShowWelcomeMessage(false)}>
                <X size={20} className={theme === 'dark' ? 'text-green-400' : 'text-green-600'} />
              </button>
            </div>
          </div>
        </div>
      )}

      <AIChat
        theme={theme}
        isOpen={aiChatOpen}
        onToggle={() => setAiChatOpen(!aiChatOpen)}
        messages={aiMessages}
        input={aiInput}
        setInput={setAiInput}
        onSend={sendAIMessage}
        loading={aiLoading}
      />

      <HeroSection projects={projects} theme={theme} />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {otpVerifiedEmail && (
          <div className="mb-8">
            <div className={`${theme === 'dark' ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border rounded-2xl px-6 py-4 inline-flex items-center gap-3`}>
              <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <div>
                <p className={`font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>Email tasdiqlangan</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>{otpVerifiedEmail}</p>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} w-5 h-5`} />
            <input
              type="text"
              placeholder="Loyihalarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} border rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm`}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition ${
                selectedCategory === cat.name
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loyihalar ({filteredProjects.length})
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-7xl mb-4">🚀</p>
              <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>
                Hali loyihalar yo'q
              </p>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Birinchi bo'lib loyihangizni yarating!
              </p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                theme={theme}
                onVote={handleVote}
                onOpen={(p) => { setSelectedProject(p); setShowDetailModal(true); }}
              />
            ))
          )}
        </div>
      </div>

      <AboutSection theme={theme} onCreateClick={() => setShowCreateModal(true)} />

      <footer className={`${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-800' : 'bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200'} border-t py-16 mt-20`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoImage} alt="Sherik Top" className="w-10 h-10" />
                <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Sherik<span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>Top</span>
                </h3>
              </div>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6 leading-relaxed`}>
                O'zbekistonning eng yirik sheriklar topish platformasi.
              </p>
              <div className="flex gap-3">
                {[Instagram, Facebook, MessageCircle].map((Icon, i) => (
                  <a key={i} href="#" className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} rounded-lg flex items-center justify-center transition shadow-sm`}>
                    <Icon size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Sahifalar</h4>
              <ul className="space-y-3">
                {['Biz haqimizda', 'Loyihalar', 'Narxlar', 'Yordam'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Huquqiy</h4>
              <ul className="space-y-3">
                {['Maxfiylik siyosati', 'Foydalanish shartlari', 'Cookie siyosati', "Bog'lanish"].map((item) => (
                  <li key={item}>
                    <a href="#" className={`${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} text-center`}>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              © 2026 Sherik Top. Barcha huquqlar himoyalangan.
            </p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Sevgi bilan yaratildi ❤️
            </p>
          </div>
        </div>
      </footer>

      {showCreateModal && (
        <CreateModal
          theme={theme}
          newProject={newProject}
          setNewProject={setNewProject}
          profile={profile}
          user={user}
          onClose={() => {
            setShowCreateModal(false);
            setNewProject({ title: '', description: '', category: 'Texnologiya', looking_for: '', stage: "G'oya", image: null, imagePreview: null });
          }}
          onCreate={handleCreateProject}
          onImageChange={handleImageChange}
        />
      )}

      {showDetailModal && selectedProject && (
        <DetailModal
          project={selectedProject}
          theme={theme}
          onClose={() => setShowDetailModal(false)}
          onVote={handleVote}
        />
      )}

    </div>
  );
};

export default Home;