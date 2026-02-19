// src/components/home/DetailModal.jsx
import { X, TrendingUp, MessageCircle } from "lucide-react";

const DetailModal = ({ project, theme, onClose, onVote }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
        
        {project.image_url && (
          <img src={project.image_url} alt={project.title} className="w-full h-64 object-cover rounded-t-3xl" />
        )}

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {project.title}
            </h2>
            <button
              onClick={onClose}
              className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'} p-2`}
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-4 py-2 ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'} rounded-lg text-sm font-semibold`}>
              {project.category}
            </span>
            <span className={`px-4 py-2 ${theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'} rounded-lg text-sm font-semibold`}>
              {project.stage}
            </span>
            <span className={`px-4 py-2 ${theme === 'dark' ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-700'} rounded-lg text-sm font-semibold`}>
              Ovozlar: {project.votes || 0}
            </span>
          </div>

          <div className="mb-6">
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
              Loyiha haqida:
            </h3>
            <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-xl p-4`}>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} leading-relaxed whitespace-pre-line`}>
                {project.description}
              </p>
            </div>
          </div>

          {project.looking_for && project.looking_for.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}>
                Izlayapti:
              </h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(project.looking_for) ? project.looking_for : [project.looking_for]).map((skill, i) => (
                  <span key={i} className={`px-4 py-2 ${
                    theme === 'dark' ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  } rounded-lg text-sm font-semibold`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={`flex items-center justify-between pt-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-t`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {project.author?.[0]?.toUpperCase() || 'A'}
              </div>
              <div>
                <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {project.author || 'Anonim'}
                </p>
                {project.telegram && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    @{project.telegram.replace('@', '')}
                  </p>
                )}
              </div>
            </div>

            {project.telegram && (
              <a
                href={`https://t.me/${project.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition inline-flex items-center gap-2"
              >
                <MessageCircle size={20} />
                Bog'lanish
              </a>
            )}
          </div>

          <div className={`flex gap-4 mt-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => onVote(project.id)}
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-4 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <TrendingUp size={20} />
              Ovoz berish ({project.votes || 0})
            </button>
            <button
              onClick={onClose}
              className={`flex-1 px-6 py-4 ${
                theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              } border-2 rounded-xl font-bold transition`}
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;