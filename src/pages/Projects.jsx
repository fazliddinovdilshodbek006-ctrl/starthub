import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Projects = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
  }, [projects, searchTerm, selectedCategory, sortBy]);

  const loadProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          user_type
        )
      `)
      .order('created_at', { ascending: false });
    
    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const filterAndSortProjects = () => {
    let filtered = [...projects];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.tags && project.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Category filter for investors
    if (selectedCategory !== 'all' && profile?.user_type === 'investor') {
      filtered = filtered.filter(project =>
        project.tags && project.tags.includes(selectedCategory)
      );
    }

    // Sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredProjects(filtered);
  };

  const categories = [
    'Education', 'Technology', 'Healthcare', 'Finance',
    'Social', 'Agriculture', 'Real Estate'
  ];

  const getCategoryRecommendations = () => {
    if (profile?.user_type === 'investor' && profile.interested_fields) {
      return profile.interested_fields;
    }
    return [];
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Explore Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover innovative projects from our community
        </p>
      </div>

      {/* Recommendations for Investors */}
      {profile?.user_type === 'investor' && getCategoryRecommendations().length > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recommended for you
            </h3>
            <button
              onClick={() => {
                if (getCategoryRecommendations().length > 0) {
                  setSelectedCategory(getCategoryRecommendations()[0]);
                }
              }}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
            >
              View all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {getCategoryRecommendations().map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedCategory === category
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-dark-border transition-colors duration-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="w-full md:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <div 
                key={project.id} 
                className="bg-white dark:bg-dark-card rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 dark:border-dark-border overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="p-6">
                  {/* Project Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {project.title}
                      </h3>
                      <div className="flex items-center mt-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                          {project.profiles?.first_name?.[0]}{project.profiles?.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {project.profiles?.first_name} {project.profiles?.last_name}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            project.profiles?.user_type === 'student' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                            project.profiles?.user_type === 'developer' ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200' :
                            project.profiles?.user_type === 'investor' ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' :
                            'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                          }`}>
                            {project.profiles?.user_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description || 'No description provided.'}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 text-xs bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-lg">
                          +{project.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => window.location.href = `/profile/${project.profiles?.id}`}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      View Profile
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-dark-card rounded-2xl shadow-lg border border-gray-200 dark:border-dark-border">
              <div className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {searchTerm 
                  ? `No projects match "${searchTerm}"`
                  : selectedCategory !== 'all'
                  ? `No projects in "${selectedCategory}" category`
                  : 'No projects have been created yet'
                }
              </p>
              {(searchTerm || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Projects;