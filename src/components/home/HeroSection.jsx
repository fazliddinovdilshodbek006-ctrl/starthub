// src/components/home/HeroSection.jsx
const HeroSection = ({ projects, theme }) => {
  const heroGradient = theme === 'dark' 
    ? 'from-gray-900 via-indigo-900 to-purple-900'
    : 'from-blue-600 via-indigo-600 to-purple-600';

  return (
    <div className={`bg-gradient-to-br ${heroGradient} text-white pt-32 pb-20 relative overflow-hidden`}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            G'oyangiz bor?<br/>
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Sherik topamiz!
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 font-medium">
            Tadbirkorlik va hamkorlik uchun zamonaviy platforma
          </p>
          
          <div className="flex justify-center gap-12 md:gap-20">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">{projects.length}</p>
              <p className="text-white/80">Loyihalar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">
                {projects.reduce((sum, p) => sum + (Number(p.votes) || 0), 0)}
              </p>
              <p className="text-white/80">Ovozlar</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">500+</p>
              <p className="text-white/80">Foydalanuvchi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;