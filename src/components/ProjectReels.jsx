// ProjectReels.jsx - Instagram Reels kabi loyihalar ko'rinishi
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, User, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ProjectReels = ({ projects, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState({});
  const [saved, setSaved] = useState({});
  const [showComments, setShowComments] = useState(false);
  const { theme } = useTheme();
  const reelsRef = useRef(null);

  const currentProject = projects[currentIndex];

  // Scroll boshqarish
  useEffect(() => {
    const handleScroll = (e) => {
      const delta = e.deltaY;
      if (delta > 0 && currentIndex < projects.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (delta < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, [currentIndex, projects.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowDown' && currentIndex < projects.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, projects.length, onClose]);

  const handleLike = (projectId) => {
    setLikes(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleSave = (projectId) => {
    setSaved(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };

  const handleShare = async (project) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link nusxalandi!');
    }
  };

  if (!currentProject) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition backdrop-blur-sm"
      >
        <X size={24} />
      </button>

      {/* Progress indicators */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1">
        {projects.map((_, idx) => (
          <div
            key={idx}
            className={`h-0.5 transition-all ${
              idx === currentIndex 
                ? 'w-8 bg-white' 
                : idx < currentIndex
                ? 'w-8 bg-white/50'
                : 'w-8 bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div 
        ref={reelsRef}
        className="h-full w-full flex items-center justify-center overflow-hidden"
        style={{
          background: currentProject.image_url 
            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${currentProject.image_url})`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Content Container */}
        <div className="relative w-full max-w-md h-full flex flex-col justify-end p-6 pb-24">
          {/* Project Info */}
          <div className="space-y-4 text-white">
            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center font-bold text-lg">
                {currentProject.author?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className="font-bold">{currentProject.author || 'Anonim'}</p>
                {currentProject.telegram && (
                  <p className="text-sm opacity-80">@{currentProject.telegram}</p>
                )}
              </div>
              <button className="ml-auto px-4 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium transition">
                A'zo bo'lish
              </button>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold">{currentProject.title}</h2>

            {/* Description */}
            <p className="text-sm opacity-90 line-clamp-3">
              {currentProject.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-500/30 backdrop-blur-sm rounded-full text-xs font-medium">
                {currentProject.category}
              </span>
              <span className="px-3 py-1 bg-purple-500/30 backdrop-blur-sm rounded-full text-xs font-medium">
                {currentProject.stage}
              </span>
              {currentProject.looking_for && currentProject.looking_for.length > 0 && (
                <span className="px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-xs font-medium">
                  👥 {Array.isArray(currentProject.looking_for) 
                    ? currentProject.looking_for[0] 
                    : currentProject.looking_for}
                </span>
              )}
            </div>

            {/* Action Button */}
            {currentProject.telegram && (
              <a
                href={`https://t.me/${currentProject.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition"
              >
                <MessageCircle size={20} />
                Bog'lanish
              </a>
            )}
          </div>
        </div>

        {/* Right Sidebar - Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6">
          {/* Like */}
          <button
            onClick={() => handleLike(currentProject.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full backdrop-blur-sm transition ${
              likes[currentProject.id]
                ? 'bg-red-500 scale-110'
                : 'bg-white/20 hover:bg-white/30'
            }`}>
              <Heart
                size={28}
                className={`${
                  likes[currentProject.id] 
                    ? 'fill-white text-white' 
                    : 'text-white'
                }`}
              />
            </div>
            <span className="text-white text-sm font-medium">
              {(currentProject.votes || 0) + (likes[currentProject.id] ? 1 : 0)}
            </span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition">
              <MessageCircle size={28} className="text-white" />
            </div>
            <span className="text-white text-sm font-medium">12</span>
          </button>

          {/* Share */}
          <button
            onClick={() => handleShare(currentProject)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition">
              <Share2 size={28} className="text-white" />
            </div>
          </button>

          {/* Save */}
          <button
            onClick={() => handleSave(currentProject.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`p-3 rounded-full backdrop-blur-sm transition ${
              saved[currentProject.id]
                ? 'bg-yellow-500 scale-110'
                : 'bg-white/20 hover:bg-white/30'
            }`}>
              <Bookmark
                size={28}
                className={`${
                  saved[currentProject.id] 
                    ? 'fill-white text-white' 
                    : 'text-white'
                }`}
              />
            </div>
          </button>

          {/* Avatar (clones for effect) */}
          <div className="mt-4 flex flex-col -space-y-2">
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-purple-400 to-pink-400" />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-blue-400 to-cyan-400" />
            <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
              +5
            </div>
          </div>
        </div>

        {/* Navigation Hints */}
        {currentIndex < projects.length - 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs flex items-center gap-2 animate-bounce">
            <span>Pastga aylantiring</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[70vh] overflow-y-auto p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Fikrlar</h3>
            <button
              onClick={() => setShowComments(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <p className="text-center text-gray-500 py-8">Hali fikrlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectReels;