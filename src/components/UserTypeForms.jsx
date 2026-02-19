import React, { useState } from 'react';

const UserTypeForms = ({ userType, onSubmit }) => {
  const [formData, setFormData] = useState({});

  if (userType === 'student') {
    return <StudentForm formData={formData} setFormData={setFormData} onSubmit={onSubmit} />;
  }
  if (userType === 'developer') {
    return <DeveloperForm formData={formData} setFormData={setFormData} onSubmit={onSubmit} />;
  }
  if (userType === 'investor') {
    return <InvestorForm formData={formData} setFormData={setFormData} onSubmit={onSubmit} />;
  }

  return (
    <button 
      onClick={() => onSubmit({})}
      className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      Create Profile
    </button>
  );
};

// Student Form
const StudentForm = ({ formData, setFormData, onSubmit }) => {
  const handleSubmit = () => {
    if (!formData.university || !formData.major) {
      alert('Please fill all required fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          University
        </label>
        <input
          type="text"
          value={formData.university || ''}
          onChange={(e) => setFormData({...formData, university: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
          placeholder="University name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Degree
        </label>
        <select
          value={formData.degree || 'bachelor'}
          onChange={(e) => setFormData({...formData, degree: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
        >
          <option value="bachelor">Bachelor</option>
          <option value="master">Master</option>
          <option value="phd">PhD</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Year
        </label>
        <input
          type="number"
          min="1"
          max="6"
          value={formData.year || 1}
          onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Major
        </label>
        <input
          type="text"
          value={formData.major || ''}
          onChange={(e) => setFormData({...formData, major: e.target.value})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
          placeholder="IT, Economics, etc."
          required
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-primary-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Create Profile
      </button>
    </div>
  );
};

// Developer Form
const DeveloperForm = ({ formData, setFormData, onSubmit }) => {
  const techStack = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#',
    'React', 'Vue', 'Angular', 'Next.js', 'Node.js',
    'Django', 'Flask', 'Spring', 'Laravel',
    'React Native', 'Flutter', 'Swift', 'Kotlin',
    'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'
  ];

  const toggleTech = (tech) => {
    const currentStack = formData.stack || [];
    const newStack = currentStack.includes(tech)
      ? currentStack.filter(t => t !== tech)
      : [...currentStack, tech];
    
    setFormData({ ...formData, stack: newStack });
  };

  const handleSubmit = () => {
    if (!formData.stack || formData.stack.length === 0) {
      alert('Please select at least one technology');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tech Stack
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Select technologies you work with
        </p>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {techStack.map(tech => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTech(tech)}
              className={`px-3 py-2 rounded-full text-sm transition-all duration-200 ${
                (formData.stack || []).includes(tech)
                  ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Years of Experience
        </label>
        <input
          type="number"
          min="0"
          max="50"
          value={formData.years_of_experience || 0}
          onChange={(e) => setFormData({...formData, years_of_experience: parseInt(e.target.value)})}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-primary-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Create Profile
      </button>
    </div>
  );
};

// Investor Form
const InvestorForm = ({ formData, setFormData, onSubmit }) => {
  const investmentFields = [
    'Education', 'Technology', 'Healthcare', 'Finance',
    'Social', 'Agriculture', 'Real Estate', 'Transport',
    'Energy', 'Tourism', 'Sports', 'Art'
  ];

  const toggleField = (field) => {
    const currentFields = formData.interested_fields || [];
    const newFields = currentFields.includes(field)
      ? currentFields.filter(f => f !== field)
      : [...currentFields, field];
    
    setFormData({ ...formData, interested_fields: newFields });
  };

  const handleSubmit = () => {
    if (!formData.interested_fields || formData.interested_fields.length === 0) {
      alert('Please select at least one investment field');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Investment Interests
        </label>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          Projects in these fields will be recommended to you
        </p>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {investmentFields.map(field => (
            <button
              key={field}
              type="button"
              onClick={() => toggleField(field)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                (formData.interested_fields || []).includes(field)
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-primary-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        Create Profile
      </button>
    </div>
  );
};

export default UserTypeForms;