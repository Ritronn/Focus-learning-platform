import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, Target, Clock, TrendingUp, Brain, Zap, Chrome } from 'lucide-react';
import extensionService from '../services/extensionService';

const Dashboard = ({ userPreferences, onStartStudy, isStudyActive, currentStudyMode, onEndStudy }) => {
  const navigate = useNavigate();
  const [studyStats, setStudyStats] = useState({
    todayStudyTime: 0,
    weeklyGoal: 14, // hours
    focusScore: 85,
    streakDays: 7,
    tabSwitches: 0,
    attentionDrift: 'Low',
    attentionScore: 100,
    extensionActive: false
  });

  const [timer, setTimer] = useState(0);

  // Timer for active study session
  useEffect(() => {
    let interval;
    if (isStudyActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isStudyActive]);

  // Load extension stats only once on mount
  useEffect(() => {
    const loadExtensionStats = async () => {
      await extensionService.checkExtension();
      const stats = await extensionService.getStats();
      
      setStudyStats(prev => ({
        ...prev,
        tabSwitches: stats.tabSwitches,
        attentionScore: stats.attentionScore,
        extensionActive: stats.isExtensionActive,
        attentionDrift: stats.tabSwitches > 15 ? 'High' : stats.tabSwitches > 8 ? 'Medium' : 'Low'
      }));
    };

    loadExtensionStats();
  }, []);

  const studyModes = [
    {
      id: 'normal',
      name: 'Normal Mode',
      description: 'Light restrictions, notifications blocked',
      duration: 25,
      color: 'bg-green-500',
      icon: <Target className="w-6 h-6" />,
      restrictions: {
        notifications: true,
        tabSwitchWarning: false,
        blockedSites: []
      }
    },
    {
      id: 'medium',
      name: 'Focus Mode',
      description: 'Medium restrictions, social media blocked',
      duration: 45,
      color: 'bg-yellow-500',
      icon: <Brain className="w-6 h-6" />,
      restrictions: {
        notifications: true,
        tabSwitchWarning: true,
        blockedSites: ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com']
      }
    },
    {
      id: 'ultra',
      name: 'Ultra Focus',
      description: 'Maximum restrictions, all distractions blocked',
      duration: 90,
      color: 'bg-red-500',
      icon: <Zap className="w-6 h-6" />,
      restrictions: {
        notifications: true,
        tabSwitchWarning: true,
        blockedSites: ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'youtube.com', 'reddit.com', 'netflix.com']
      }
    }
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAttentionColor = (level) => {
    switch(level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {userPreferences?.name || 'Learner'}! 👋
        </h1>
        <p className="text-gray-600">Ready to forge your mind and learn effectively?</p>
      </div>

      {/* Active Study Session */}
      {isStudyActive && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Active Study Session</h2>
              <p className="opacity-90">{currentStudyMode?.name} - {formatTime(timer)}</p>
            </div>
            <button
              onClick={onEndStudy}
              className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
            >
              <Pause className="w-4 h-4" />
              <span>End Session</span>
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold text-gray-800">{studyStats.todayStudyTime}h</span>
          </div>
          <h3 className="font-semibold text-gray-700">Today's Study Time</h3>
          <p className="text-sm text-gray-500">Goal: {userPreferences?.dailyStudyGoal || 2}h</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{studyStats.attentionScore}%</span>
              {studyStats.extensionActive && (
                <div className="flex items-center justify-end mt-1">
                  <Chrome className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">Live</span>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-semibold text-gray-700">Attention Score</h3>
          <p className="text-sm text-gray-500">{studyStats.extensionActive ? 'Real-time from extension' : 'Extension not connected'}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-orange-500" />
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-800">{studyStats.tabSwitches}</span>
              {studyStats.extensionActive && (
                <div className="flex items-center justify-end mt-1">
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    studyStats.tabSwitches > 15 ? 'bg-red-500' : 
                    studyStats.tabSwitches > 8 ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className="text-xs text-gray-600">Live tracking</span>
                </div>
              )}
            </div>
          </div>
          <h3 className="font-semibold text-gray-700">Tab Switches</h3>
          <p className="text-sm text-gray-500">Current session</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-purple-500" />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAttentionColor(studyStats.attentionDrift)}`}>
              {studyStats.attentionDrift}
            </span>
          </div>
          <h3 className="font-semibold text-gray-700">Attention Drift</h3>
          <p className="text-sm text-gray-500">Based on behavior</p>
        </div>
      </div>

      {/* Study Modes */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Choose Your Study Mode</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studyModes.map((mode) => (
            <div key={mode.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`${mode.color} p-2 rounded-lg text-white`}>
                  {mode.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{mode.name}</h3>
                  <p className="text-sm text-gray-500">{mode.duration} minutes</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 text-sm">{mode.description}</p>
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Restrictions:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Notifications blocked</li>
                  {mode.restrictions.tabSwitchWarning && <li>• Tab switch warnings</li>}
                  {mode.restrictions.blockedSites.length > 0 && (
                    <li>• {mode.restrictions.blockedSites.length} websites blocked</li>
                  )}
                </ul>
              </div>
              <button
                onClick={() => onStartStudy(mode)}
                disabled={isStudyActive}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isStudyActive 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Start Session</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Continue Learning</h3>
          <p className="text-sm opacity-90 mb-4">Pick up where you left off</p>
          <button 
            onClick={() => navigate('/courses')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Courses
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-2">Daily Reading</h3>
          <p className="text-sm opacity-90 mb-4">Maintain your reading streak</p>
          <button 
            onClick={() => navigate('/daily-reading')}
            className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;