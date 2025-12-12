import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, TrendingUp, Zap, MessageCircle } from 'lucide-react';
import './App.css';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Hammasi');
  
  const categories = [
    { name: 'Hammasi', icon: '🌟' },
    { name: 'Texnologiya', icon: '💻' },
    { name: 'Ta\'lim', icon: '📚' },
    { name: 'Sog\'liq', icon: '🏥' },
    { name: 'Moliya', icon: '💰' },
    { name: 'Ijtimoiy', icon: '🤝' },
    { name: 'Boshqa', icon: '🎯' }
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
    const savedProjects = localStorage.getItem('starthub_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error('Error loading projects:', e);
      }
    }
  }, []);

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description || !newProject.author || !newProject.telegram) {
      alert('Iltimos, barcha majburiy maydonlarni to\'ldiring!');
      return;
    }

    const project = {
      ...newProject,
      id: Date.now().toString(),
      votes: 0,
      created_at: new Date().toISOString()
    };

    const updatedProjects = [project, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('starthub_projects', JSON.stringify(updatedProjects));
    
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
    alert('Loyihangiz muvaffaqiyatli yaratildi! 🎉');
  };

  const handleVote = (projectId) => {
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        return { ...p, votes: p.votes + 1 };
      }
      return p;
    });
    const sortedProjects = updatedProjects.sort((a, b) => b.votes - a.votes);
    setProjects(sortedProjects);
    localStorage.setItem('starthub_projects', JSON.stringify(sortedProjects));
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Hammasi' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  StartHub
                </h1>
                <p className="text-xs text-gray-600">Yoshlar Tadbirkorlik Platformasi</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={20} />
              Loyiha Yaratish
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            G'oyangiz Bor? Sherik Topasizmi?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Yoshlar o'rtasida tadbirkorlikni rivojlantirish, sheriklar topish va startup yaratish platformasi
          </p>
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{projects.length}</div>
              <div className="text-sm opacity-90">Loyihalar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{projects.reduce((sum, p) => sum + p.votes, 0)}</div>
              <div className="text-sm opacity-90">Ovozlar</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Loyiha izlash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Hali loyihalar yo'q</h3>
              <p className="text-gray-600">Birinchi bo'lib o'z loyihangizni yarating!</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-2">
                        {project.stage}
                      </span>
                    </div>
                    <button
                      onClick={() => handleVote(project.id)}
                      className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-red-500 text-white px-3 py-1 rounded-lg hover:shadow-md transition-all"
                    >
                      <TrendingUp size={16} />
                      {project.votes}
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                  {project.looking_for && (
                    <div className="flex items-center gap-2 mb-4">
                      <Users size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">Izlayapti: {project.looking_for}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                        {project.author[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">{project.author}</span>
                    </div>
                    <a
                      href={`https://t.me/${project.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Yangi Loyiha Yaratish</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sizning Ismingiz *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Alisher"
                    value={newProject.author}
                    onChange={(e) => setNewProject({...newProject, author: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loyiha Nomi *
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: O'quv platformasi yoshlar uchun"
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tavsif *
                  </label>
                  <textarea
                    placeholder="Loyihangiz haqida batafsil yozing..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategoriya
                    </label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bosqich
                    </label>
                    <select
                      value={newProject.stage}
                      onChange={(e) => setNewProject({...newProject, stage: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option>G'oya</option>
                      <option>MVP</option>
                      <option>Rivojlantirish</option>
                      <option>Tayyor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kimlarni Izlayapsiz?
                  </label>
                  <input
                    type="text"
                    placeholder="Masalan: Dasturchi, Dizayner, Marketing mutaxassis"
                    value={newProject.looking_for}
                    onChange={(e) => setNewProject({...newProject, looking_for: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telegram Username *
                  </label>
                  <input
                    type="text"
                    placeholder="@username"
                    value={newProject.telegram}
                    onChange={(e) => setNewProject({...newProject, telegram: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  Yaratish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            🚀 StartHub - Yoshlar o'rtasida tadbirkorlikni rivojlantirish platformasi
          </p>
          <p className="text-gray-500 text-sm mt-2">
            G'oyangiz bor? Sherik kerakmi? Biz bilan boshlang!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;