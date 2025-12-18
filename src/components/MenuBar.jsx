import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Folder, User, Bot, Target } from 'lucide-react';

const MenuBar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/about', label: 'About Us', icon: <Users size={20} /> },
    { path: '/projects', label: 'Loyihalar', icon: <Folder size={20} /> },
    { path: '/ai-assistant', label: 'AI Assistant', icon: <Bot size={20} /> },
    { path: '/profile', label: 'Profil', icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <Target className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-gray-800">Sherik Top</span>
          </Link>

          {/* Menu Items */}
          <div className="flex items-center space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MenuBar;