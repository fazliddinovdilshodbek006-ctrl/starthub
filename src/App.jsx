import React, { useState } from 'react';
import './App.css'; // Bu faylda Tailwind direktivalari qoladi

// Loyihalar uchun "mock" (soxta) ma'lumotlar massivi
const mockProjects = [
  {
    id: 1,
    title: "Onlayn Ta'lim Platformasi",
    description: "Yoshlarga dasturlashni o'rgatishga qaratilgan interaktiv veb-platforma. Kerak: mentorlar, frontend dasturchi.",
    category: "Ta'lim",
    views: 1240,
  },
  {
    id: 2,
    title: "Qishloq xo'jaligi uchun AI",
    description: "Fermerlarga hosildorlikni oshirishda yordam beruvchi mobil ilova. Kerak: AI mutaxassisi, mobil dasturchi.",
    category: "AgroTech",
    views: 890,
  },
  {
    id: 3,
    title: "Startup Hub Ijtimoiy Tarmoq",
    description: "G'oyalarni muhokama qilish va jamoa topish uchun ijtimoiy tarmoq. Kerak: UI/UX dizayner, backend mutaxassisi.",
    category: "Community",
    views: 2100,
  },
];

// Asosiy App komponenti
function App() {
  // Haqiqiy ma'lumotlar bazasiga ulanishdan oldin mock datadan foydalanamiz
  const [projects, setProjects] = useState(mockProjects);

  return (
    // Tailwind CSS yordamida sodda dizayn
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Startup.version1: Loyihalar Markazi
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Yoshlar, g'oyalar, hamkorlik!
        </p>
      </header>

      <main className="max-w-4xl mx-auto">
        {/* Loyihalarni ko'rsatish oynasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                {project.category}
              </span>
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex justify-between items-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Batafsil & Bog'lanish
                </button>
                <span className="text-sm text-gray-500">
                  👁️ {project.views} marta ko'rilgan
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-500">
          <p>Claude Startup V1 | Tadbirkorlikni rivojlantiramiz</p>
      </footer>
    </div>
  );
}

export default App;
