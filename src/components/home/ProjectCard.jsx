// src/components/home/ProjectCard.jsx
import { TrendingUp, Users, MessageCircle } from "lucide-react";

const ProjectCard = ({ project, theme, onVote, onOpen }) => {
  return (
    <div
      onClick={(e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          onOpen(project);
        }
      }}
      className={`group ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500'
          : 'bg-white border-gray-200 hover:border-blue-400'
      } border-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1`}
    >
      {project.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1.5 ${
              theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
            } rounded-lg text-xs font-semibold`}>
              {project.category}
            </span>
            <span className={`px-3 py-1.5 ${
              theme === 'dark' ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700'
            } rounded-lg text-xs font-semibold`}>
              {project.stage}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(project.id);
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 rounded-lg hover:shadow-md transition font-semibold"
          >
            <TrendingUp size={16} />
            {project.votes || 0}
          </button>
        </div>

        <h3 className={`text-xl font-bold ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        } mb-3 line-clamp-2`}>
          {project.title}
        </h3>

        <p className={`${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        } text-sm line-clamp-3 mb-5`}>
          {project.description}
        </p>

        {project.looking_for && project.looking_for.length > 0 && (
          <div className={`flex items-center gap-2 mb-5 ${
            theme === 'dark' ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
          } p-3 rounded-lg`}>
            <Users size={16} />
            <span className="text-sm font-medium">
              {Array.isArray(project.looking_for)
                ? project.looking_for.join(', ')
                : project.looking_for}
            </span>
          </div>
        )}

        <div className={`flex items-center justify-between pt-5 border-t ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
              {project.author?.[0]?.toUpperCase() || 'A'}
            </div>
            <span className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            } font-medium`}>
              {project.author || 'Anonim'}
            </span>
          </div>
          {project.telegram && (
            <a
              href={`https://t.me/${project.telegram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition text-sm font-semibold"
            >
              <MessageCircle size={14} />
              Bog'lanish
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;