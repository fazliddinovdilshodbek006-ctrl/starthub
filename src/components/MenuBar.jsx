import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Sun, Moon, ChevronDown, Edit, Camera, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../context/ThemeContext';
import logoImage from '../assets/logo.png'; // ✅ TUZATILDI

const MenuBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('uzb'); // Til state
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const profileRef = useRef(null);

  const translations = {
    uzb: {
      home: 'Bosh sahifa',
      projects: 'Loyihalar',
      about: 'Biz haqimizda',
      profile: 'Profil',
      editProfile: 'Profilni tahrirlash',
      settings: 'Sozlamalar',
      logout: 'Chiqish',
      login: 'Kirish',
      createProject: 'Loyiha Yaratish'
    },
    eng: {
      home: 'Home',
      projects: 'Projects',
      about: 'About Us',
      profile: 'Profile',
      editProfile: 'Edit Profile',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Login',
      createProject: 'Create Project'
    },
    rus: {
      home: 'Главная',
      projects: 'Проекты',
      about: 'О нас',
      profile: 'Профиль',
      editProfile: 'Редактировать',
      settings: 'Настройки',
      logout: 'Выход',
      login: 'Войти',
      createProject: 'Создать проект'
    }
  };

  const t = translations[language];

  useEffect(() => {
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) loadProfile(session.user.id);
    });

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) await loadProfile(user.id);
    setLoading(false);
  };

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error) setProfile(data);
    } catch (err) {
      console.error('Profile yuklashda xato:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsProfileOpen(false);
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-sm`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img 
              src={logoImage}
              alt="Sherik Top Logo" 
              className="w-40 h-12 object-contain transform group-hover:scale-105 transition-transform"
            />
            <div className="flex items-baseline">
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-[#1e3a8a]'}`}>
                Sherik
              </span>
              <span className="text-2xl font-bold text-[#ff8c1a]">
                Top
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-base font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              {t.home}
            </Link>
            
            <button
              onClick={() => scrollToSection('projects-section')}
              className={`text-base font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              {t.projects}
            </button>
            
            <button
              onClick={() => scrollToSection('about-section')}
              className={`text-base font-medium transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
            >
              {t.about}
            </button>

            {/* Til Almashtirish */}
            <div className="flex items-center gap-2 border-l pl-6 ml-2">
              <Globe size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
              <button
                onClick={() => setLanguage('uzb')}
                className={`px-2 py-1 text-sm font-semibold rounded transition ${
                  language === 'uzb'
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Uzb
              </button>
              <button
                onClick={() => setLanguage('eng')}
                className={`px-2 py-1 text-sm font-semibold rounded transition ${
                  language === 'eng'
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Eng
              </button>
              <button
                onClick={() => setLanguage('rus')}
                className={`px-2 py-1 text-sm font-semibold rounded transition ${
                  language === 'rus'
                    ? 'bg-blue-600 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                Rus
              </button>
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openCreateModal'))}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  {t.createProject}
                </button>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={18} className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} overflow-hidden`}>
                      <div className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                              {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg leading-tight mb-1">{profile?.full_name || 'Foydalanuvchi'}</h3>
                            <p className="text-sm text-blue-100 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <User size={20} />
                          <span className="font-medium">{t.profile}</span>
                        </Link>
                        
                        <Link
                          to="/profile/edit"
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <Edit size={20} />
                          <span className="font-medium">{t.editProfile}</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
                        >
                          <Settings size={20} />
                          <span className="font-medium">{t.settings}</span>
                        </Link>
                      </div>

                      <div className={`p-2 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                        >
                          <LogOut size={20} />
                          <span className="font-medium">{t.logout}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                {t.login}
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 pb-4 space-y-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <Link to="/" className="block py-2.5 font-medium" onClick={() => setIsMenuOpen(false)}>{t.home}</Link>
            <button onClick={() => scrollToSection('projects-section')} className="block py-2.5 font-medium w-full text-left">{t.projects}</button>
            <button onClick={() => scrollToSection('about-section')} className="block py-2.5 font-medium w-full text-left">{t.about}</button>
            <button onClick={toggleTheme} className="flex items-center gap-2 py-2.5 font-medium">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              {theme === 'dark' ? 'Yorug\' rejim' : 'Tungi rejim'}
            </button>
            {user ? (
              <>
                <Link to="/profile" className="block py-2.5 font-medium" onClick={() => setIsMenuOpen(false)}>{t.profile}</Link>
                <button onClick={() => { window.dispatchEvent(new CustomEvent('openCreateModal')); setIsMenuOpen(false); }} className="block py-2.5 text-blue-600 font-semibold">+ {t.createProject}</button>
                <button onClick={handleLogout} className="block py-2.5 text-red-600 font-medium">{t.logout}</button>
              </>
            ) : (
              <Link to="/auth" className="block py-2.5 text-blue-600 font-semibold" onClick={() => setIsMenuOpen(false)}>{t.login}</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MenuBar;