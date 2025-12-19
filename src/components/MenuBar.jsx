import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // X ikonkasini import qo'shing

const MenuBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="navbar fixed top-0 left-0 right-0 z-50 mx-auto max-w-7xl px-4 py-4">
            <div className="logo-container">
                <div className="logo-shape"></div>
                <Link to="/" className="logo-text no-underline">
    Sherik<span>Top</span>
</Link>
            </div>
            
            <div className={`menu ${isMenuOpen ? 'active' : ''}`}>
                <Link 
                    to="/" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Kirish
                </Link>
                <Link 
                    to="/projects" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Loyihalar
                </Link>
                <Link 
                    to="/about" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Biz haqimizda
                </Link>
                <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    Profil
                </Link>
                <Link 
                    to="/ai-assistant" 
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    AI Yordamchi
                </Link>
                
                {/* Loyiha yaratish tugmasi */}
                <Link 
                    to="/" 
                    className="btn-create no-underline"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsMenuOpen(false);
                        // Bu yerda loyiha yaratish modalini ochish logikasi
                        // Agar loyihanizda boshqa usul bo'lsa, o'zgartiring
                        window.dispatchEvent(new CustomEvent('openCreateModal'));
                    }}
                >
                    + Loyiha Yaratish
                </Link>
                
                {/* Hamburger tugmasi */}
                <button 
                    className="menu-toggle"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
};

export default MenuBar;