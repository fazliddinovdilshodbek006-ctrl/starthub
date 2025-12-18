import React from 'react';

const Projects = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Loyihalar</h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Bu sahifada barcha loyihalar ro'yxati ko'rinadi. Tez orada bu sahifa to'liq ishlaydi.
          Hozircha loyihalarni bosh sahifadan ko'rishingiz mumkin.
        </p>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 text-center border border-indigo-100">
          <div className="text-8xl mb-6 animate-pulse">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Tez orada ishga tushadi!</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            Loyihalar sahifasi hozirda ishlab chiqilmoqda. Tez orada barcha loyihalarni bu yerdan ko'rishingiz mumkin bo'ladi.
          </p>
          <a 
            href="/"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl transform hover:scale-105 transition-all"
          >
            Bosh sahifaga qaytish
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;