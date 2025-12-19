import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg rounded-3xl mx-4 mt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo va sayt nomi */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl rotate-45 relative">
              <div className="w-8 h-8 bg-white rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              Sherlik<span className="text-purple-600">Topamiz</span>
            </div>
          </div>

          {/* Asosiy navigatsiya (masofaviy) */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-semibold text-lg transition duration-300 relative group"
            >
              Loyihalar
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-semibold text-lg transition duration-300 relative group"
            >
              Sheriklar qidirish
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-purple-600 font-semibold text-lg transition duration-300 relative group"
            >
              Homiylar/Investorlar
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Tugmalar (masofaviy) */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#"
              className="px-6 py-2 text-gray-700 font-semibold rounded-full hover:bg-gray-100 transition duration-300"
            >
              Kirish
            </a>
            <a
              href="#"
              className="px-6 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition duration-300 hover:scale-105"
            >
              + Loyiha Yaratish
            </a>
          </div>

          {/* Mobil menyu tugmasi */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-purple-600 focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobil menyu (ochiladigan) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 rounded-b-3xl shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <a
                href="#"
                className="block text-gray-700 hover:text-purple-600 font-semibold text-lg py-2"
              >
                Loyihalar
              </a>
              <a
                href="#"
                className="block text-gray-700 hover:text-purple-600 font-semibold text-lg py-2"
              >
                Sheriklar qidirish
              </a>
              <a
                href="#"
                className="block text-gray-700 hover:text-purple-600 font-semibold text-lg py-2"
              >
                Homiylar/Investorlar
              </a>
              <div className="pt-4 space-y-3">
                <a
                  href="#"
                  className="block text-center px-4 py-2 text-gray-700 font-semibold rounded-full border border-gray-300 hover:bg-gray-100 transition duration-300"
                >
                  Kirish
                </a>
                <a
                  href="#"
                  className="block text-center px-4 py-2 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-full shadow-lg hover:shadow-xl transition duration-300"
                >
                  + Loyiha Yaratish
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;