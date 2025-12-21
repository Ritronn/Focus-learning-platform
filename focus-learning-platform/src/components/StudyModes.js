import React, { useState, useEffect } from 'react';
import { Play, Pause, Shield, Target, Brain, Zap, AlertTriangle } from 'lucide-react';

const StudyModes = ({ onStartStudy, currentStudyMode, isStudyActive, onEndStudy }) => {
  const [timer, setTimer] = useState(0);
  const [selectedMode, setSelectedMode] = useState(null);

  const studyModes = [
    {
      id: 'normal',
      name: 'Normal Mode',
      description: 'Perfect for casual learning with minimal restrictions',
      duration: 25,
      color: 'bg-green-500',
      borderColor: 'border-green-500',
      icon: <Target className="w-8 h-8" />,
      features: [
        'Notifications blocked',
        'Basic focus tracking',
        'No website restrictions',
        'Gentle reminders'
      ],
      restrictions: {
        notifications: true,
        tabSwitchWarning: false,
        blockedSites: [],
        strictMode: false
      }
    },
    {
      id: 'medium',
      name: 'Focus Mode',
      description: 'Balanced approach with moderate restrictions for better concentration',
      duration: 45,
      color: 'bg-yellow-500',
      borderColor: 'border-yellow-500',
      icon: <Brain className="w-8 h-8" />,
      features: [
        'All notifications blocked',
        'Social media blocked',
        'Tab switch warnings',
        'Focus score tracking'
      ],
      restrictions: {
        notifications: true,
        tabSwitchWarning: true,
        blockedSites: ['facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 'snapchat.com'],
        strictMode: false
      }
    },
    {
      id: 'ultra',
      name: 'Ultra Focus',
      description: 'Maximum concentration with strict restrictions for deep work',
      duration: 90,
      color: 'bg-red-500',
      borderColor: 'border-red-500',
      icon: <Zap className="w-8 h-8" />,
      features: [
        'All distractions blocked',
        'Entertainment sites blocked',
        'Strict tab monitoring',
        'Deep focus analytics'
      ],
      restrictions: {
        notifications: true,
        tabSwitchWarning: true,
        blockedSites: [
          'facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 
          'youtube.com', 'reddit.com', 'netflix.com', 'twitch.tv',
          'discord.com', 'whatsapp.com'
        ],
        strictMode: true
      }
    }
  ];

  // Timer for active study session
  useEffect(() => {
    let interval;
    if (isStudyActive && currentStudyMode) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          const maxTime = currentStudyMode.duration * 60;
          
          if (newTime >= maxTime) {
            onEndStudy();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isStudyActive, currentStudyMode, onEndStudy]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!currentStudyMode) return 0;
    const maxTime = currentStudyMode.duration * 60;
    return (timer / maxTime) * 100;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Modes</h1>
        <p className="text-gray-600">Choose the right level of focus for your learning session</p>
      </div>

      {/* Active Session */}
      {isStudyActive && currentStudyMode && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">{currentStudyMode.name} Active</h2>
              <p className="opacity-90">Stay focused and keep learning!</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatTime(timer)}</div>
              <div className="text-sm opacity-90">
                / {currentStudyMode.duration} minutes
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-4">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000"
              style={{ width: `${getProgress()}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>{currentStudyMode.restrictions.blockedSites.length} sites blocked</span>
              </div>
              {currentStudyMode.restrictions.tabSwitchWarning && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tab monitoring active</span>
                </div>
              )}
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

      {/* Mode Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {studyModes.map((mode) => (
          <div 
            key={mode.id} 
            className={`bg-white rounded-xl border-2 p-6 transition-all cursor-pointer ${
              selectedMode?.id === mode.id 
                ? `${mode.borderColor} shadow-lg` 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedMode(mode)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`${mode.color} p-3 rounded-lg text-white`}>
                {mode.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{mode.name}</h3>
                <p className="text-sm text-gray-500">{mode.duration} minutes</p>
              </div>
            </div>

            <p className="text-gray-600 mb-4 text-sm">{mode.description}</p>

            <div className="space-y-2 mb-6">
              {mode.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartStudy(mode);
              }}
              disabled={isStudyActive}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                isStudyActive 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : `${mode.color} text-white hover:opacity-90`
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Start {mode.name}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Mode Details */}
      {selectedMode && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedMode.name} - Detailed Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Restrictions</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Notifications blocked</span>
                </div>
                {selectedMode.restrictions.tabSwitchWarning && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Tab switch warnings enabled</span>
                  </div>
                )}
                {selectedMode.restrictions.blockedSites.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {selectedMode.restrictions.blockedSites.length} websites blocked
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Blocked Websites</h4>
              <div className="max-h-32 overflow-y-auto">
                {selectedMode.restrictions.blockedSites.length > 0 ? (
                  <div className="space-y-1">
                    {selectedMode.restrictions.blockedSites.map((site, index) => (
                      <div key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                        {site}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No websites blocked in this mode</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyModes;