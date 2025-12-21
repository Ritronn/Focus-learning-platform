import React, { useState, useEffect } from 'react';
import { Chrome, Activity, Target, Clock, RefreshCw } from 'lucide-react';
import extensionService from '../services/extensionService';

const BrowserStats = () => {
  const [stats, setStats] = useState({
    tabSwitches: 0,
    attentionScore: 100,
    sessionTime: 0,
    studyMode: 'basic',
    isExtensionActive: false
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = async () => {
    setIsLoading(true);
    await extensionService.checkExtension();
    const newStats = await extensionService.getStats();
    setStats(newStats);
    setIsLoading(false);
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 3000);
    return () => clearInterval(interval);
  }, []);

  const resetSession = async () => {
    const success = await extensionService.resetSession();
    if (success) {
      loadStats();
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Chrome className={`w-6 h-6 ${stats.isExtensionActive ? 'text-green-500' : 'text-gray-400'}`} />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Browser Extension Stats</h2>
            <p className="text-sm text-gray-500">
              {stats.isExtensionActive ? 'Connected & monitoring' : 'Extension not detected'}
            </p>
          </div>
        </div>
        <button
          onClick={loadStats}
          disabled={isLoading}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {stats.isExtensionActive ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Attention Score</span>
            </div>
            <div className={`text-2xl font-bold px-3 py-1 rounded-full inline-block ${getScoreColor(stats.attentionScore)}`}>
              {stats.attentionScore}%
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Tab Switches</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.tabSwitches}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Session Time</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {stats.sessionTime}m
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <Chrome className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Extension Not Connected</h3>
          <p className="text-gray-500">Install the MindForge browser extension to see real-time stats</p>
        </div>
      )}
    </div>
  );
};

export default BrowserStats;