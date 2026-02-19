// src/components/home/AboutSection.jsx
import { Target, Users, Rocket, Heart, Star } from "lucide-react";

const AboutSection = ({ theme, onCreateClick }) => {
  return (
    <div
      id="about-section"
      className={`scroll-mt-24 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      } py-24 mt-20`}
      style={{ animation: 'fadeInUp 0.7s ease-out forwards', animationDelay: '0.2s', opacity: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Sarlavha */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
            <Target className="text-blue-600 dark:text-blue-400" size={20} />
            <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
              Biz Haqimizda
            </span>
          </div>
          <h2 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-6`}>
            <span className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}>Sherik Top</span> — Bu faqat platforma emas
          </h2>
          <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-4xl mx-auto leading-relaxed`}>
            Bu startap asoschilari, tadbirkorlar, mutaxassislar va g'oya egalari uchun yaratilgan sherik topish va hamkorlik platformasi.
          </p>
        </div>

        {/* 2 ta katta karta */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className={`${
            theme === 'dark'
              ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-800/50'
              : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
          } border-2 rounded-3xl p-10 shadow-xl`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="text-white" size={32} />
              </div>
              <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Bizning Maqsad
              </h3>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Bir xil maqsadga ega bo'lgan insonlarni bir joyga jamlash, ularni o'zaro bog'lash va yangi loyihalarning rivojlanishiga yordam berish.
            </p>
          </div>

          <div className={`${
            theme === 'dark'
              ? 'bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-800/50'
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          } border-2 rounded-3xl p-10 shadow-xl`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <h3 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Ochiq Hamjamiyat
              </h3>
            </div>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              Ochiq hamjamiyat tamoyiliga asoslangan bo'lib, har bir foydalanuvchi o'z loyihasini taqdim etishi, bilim va tajribasini ulashishi mumkin.
            </p>
          </div>
        </div>

        {/* 3 ta imkoniyat */}
        <div className="mb-16">
          <h3 className={`text-3xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-8`}>
            Platforma Imkoniyatlari
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Rocket, color: 'from-green-500 to-emerald-600', title: 'Co-founder Topish', desc: "Startapingiz uchun co-founder yoki jamoa a'zosi toping va birgalikda rivojlaning" },
              { icon: Heart, color: 'from-blue-500 to-blue-600', title: 'Hamkorlar Bilan Tanishish', desc: "G'oyangizni rivojlantirishga tayyor hamkorlar bilan tanishing va yangi yo'nalishlar oching" },
              { icon: Star, color: 'from-purple-500 to-purple-600', title: 'Mentorlar va Investorlar', desc: "Tajribali mentorlar va investorlar bilan aloqa o'rnatib, loyihangizni keyingi bosqichga olib chiqing" },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className={`${
                theme === 'dark' ? 'bg-gray-800/80 border-gray-700/50' : 'bg-white border-gray-200'
              } border-2 rounded-2xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 group`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition`}>
                  <Icon className="text-white" size={28} />
                </div>
                <h4 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>{title}</h4>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div className={`${
          theme === 'dark'
            ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-800/50'
            : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-300'
        } border-2 rounded-3xl p-12 text-center shadow-xl mb-12`}>
          <div className="text-5xl mb-6">💡</div>
          <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 leading-relaxed`}>
            "Sherik Top — bu g'oyalar uchrashadigan va <br />loyihalar jamoaga aylanadigan makon"
          </p>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Keling, birgalikda kelajakni yaratamiz! 🚀
          </p>
        </div>

        {/* CTA tugmasi */}
        <div className="text-center">
          <button
            onClick={onCreateClick}
            className={`bg-gradient-to-r ${
              theme === 'dark' ? 'from-blue-600 to-indigo-700' : 'from-blue-600 to-indigo-600'
            } text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition inline-flex items-center gap-3 hover:scale-105 transform`}
          >
            <Rocket size={24} />
            Hoziroq Boshlash
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;