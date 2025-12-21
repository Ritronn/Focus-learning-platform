import React, { useState } from 'react';
import { User, Clock, BookOpen, Target } from 'lucide-react';

const UserPreferenceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    studyHabits: [],
    preferredLearningTimes: [],
    subjects: [],
    focusLevel: 'medium',
    dailyStudyGoal: '2',
    distractionLevel: 'medium',
    preferredContentFormat: 'mixed',
    readingCategory: 'ai'
  });

  const studyHabitsOptions = [
    { id: 'pdf', label: 'PDF Reading', icon: '📄' },
    { id: 'video', label: 'Video Learning', icon: '🎥' },
    { id: 'interactive', label: 'Interactive Content', icon: '🎮' },
    { id: 'audio', label: 'Audio/Podcasts', icon: '🎧' }
  ];

  const learningTimesOptions = [
    { id: 'morning', label: 'Morning (6-12 PM)', icon: '🌅' },
    { id: 'afternoon', label: 'Afternoon (12-6 PM)', icon: '☀️' },
    { id: 'evening', label: 'Evening (6-10 PM)', icon: '🌆' },
    { id: 'night', label: 'Night (10 PM-2 AM)', icon: '🌙' }
  ];

  const subjectsOptions = [
    { id: 'programming', label: 'Programming', icon: '💻' },
    { id: 'mathematics', label: 'Mathematics', icon: '🔢' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'languages', label: 'Languages', icon: '🗣️' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'design', label: 'Design', icon: '🎨' }
  ];

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FocusLearn</h1>
          <p className="text-gray-600">Let's personalize your learning experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your age"
                min="13"
                max="100"
                required
              />
            </div>
          </div>

          {/* Study Habits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <BookOpen className="inline w-5 h-5 mr-2" />
              Preferred Study Methods
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {studyHabitsOptions.map(option => (
                <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.studyHabits.includes(option.id)}
                    onChange={() => handleCheckboxChange('studyHabits', option.id)}
                    className="mr-3 w-4 h-4 text-indigo-600"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Learning Times */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Clock className="inline w-5 h-5 mr-2" />
              Best Learning Times
            </label>
            <div className="grid md:grid-cols-2 gap-3">
              {learningTimesOptions.map(option => (
                <label key={option.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.preferredLearningTimes.includes(option.id)}
                    onChange={() => handleCheckboxChange('preferredLearningTimes', option.id)}
                    className="mr-3 w-4 h-4 text-indigo-600"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              <Target className="inline w-5 h-5 mr-2" />
              Subjects of Interest
            </label>
            <div className="grid md:grid-cols-3 gap-3">
              {subjectsOptions.map(option => (
                <label key={option.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.subjects.includes(option.id)}
                    onChange={() => handleCheckboxChange('subjects', option.id)}
                    className="mr-3 w-4 h-4 text-indigo-600"
                  />
                  <span className="text-xl mr-2">{option.icon}</span>
                  <span className="text-gray-700 text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Preferences */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Focus Level</label>
              <select
                value={formData.focusLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, focusLevel: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low - Need frequent breaks</option>
                <option value="medium">Medium - Balanced approach</option>
                <option value="high">High - Can focus for long periods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Study Goal (hours)</label>
              <select
                value={formData.dailyStudyGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyStudyGoal: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4+ hours</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reading Category</label>
              <select
                value={formData.readingCategory}
                onChange={(e) => setFormData(prev => ({ ...prev, readingCategory: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ai">AI & Technology Trends</option>
                <option value="cars">Automotive & Car Trends</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distraction Level</label>
              <select
                value={formData.distractionLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, distractionLevel: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low - Rarely get distracted</option>
                <option value="medium">Medium - Sometimes lose focus</option>
                <option value="high">High - Easily distracted</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
          >
            Start My Learning Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserPreferenceForm;