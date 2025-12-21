import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Brain } from 'lucide-react';

const Meditation = () => {
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(300); // 5 minutes default
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedSound, setSelectedSound] = useState('rain');

  const durations = [
    { value: 1, label: '1 min' },
    { value: 3, label: '3 min' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
    { value: 15, label: '15 min' },
    { value: 20, label: '20 min' }
  ];

  const sounds = [
    { id: 'rain', name: 'Rain', emoji: '🌧️' },
    { id: 'ocean', name: 'Ocean Waves', emoji: '🌊' },
    { id: 'forest', name: 'Forest', emoji: '🌲' },
    { id: 'birds', name: 'Birds', emoji: '🐦' },
    { id: 'wind', name: 'Wind', emoji: '💨' },
    { id: 'silence', name: 'Silence', emoji: '🤫' }
  ];

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      // Meditation completed
      alert('🧘‍♀️ Meditation completed! Great job on taking time for mindfulness.');
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startMeditation = () => {
    setIsActive(true);
  };

  const pauseMeditation = () => {
    setIsActive(false);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setTime(selectedDuration * 60);
  };

  const selectDuration = (duration) => {
    setSelectedDuration(duration);
    setTime(duration * 60);
    setIsActive(false);
  };

  const getProgress = () => {
    const totalTime = selectedDuration * 60;
    return ((totalTime - time) / totalTime) * 100;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Meditation</h1>
        <p className="text-gray-600">Take a moment to relax and center yourself</p>
      </div>

      {/* Main Meditation Interface */}
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-8 mb-8">
        <div className="text-center mb-8">
          {/* Timer Circle */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTime(time)}
                </div>
                <div className="text-gray-600">
                  {isActive ? 'Meditating...' : 'Ready to start'}
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <button
              onClick={resetMeditation}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-700 p-3 rounded-full transition-colors"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            
            <button
              onClick={isActive ? pauseMeditation : startMeditation}
              className="bg-white text-purple-600 p-4 rounded-full hover:bg-gray-50 transition-colors shadow-lg"
            >
              {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-700 p-3 rounded-full transition-colors"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Duration Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">Duration</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {durations.map((duration) => (
            <button
              key={duration.value}
              onClick={() => selectDuration(duration.value)}
              disabled={isActive}
              className={`p-3 rounded-lg font-medium transition-colors ${
                selectedDuration === duration.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {duration.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sound Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-4">Background Sound</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => setSelectedSound(sound.id)}
              className={`p-4 rounded-lg font-medium transition-colors flex items-center space-x-3 ${
                selectedSound === sound.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">{sound.emoji}</span>
              <span>{sound.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meditation Tips */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="w-6 h-6" />
          <h3 className="font-semibold text-lg">Meditation Tips</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-90">
          <div>
            <h4 className="font-medium mb-2">Getting Started:</h4>
            <ul className="space-y-1">
              <li>• Find a comfortable, quiet space</li>
              <li>• Sit with your back straight</li>
              <li>• Close your eyes or soften your gaze</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">During Meditation:</h4>
            <ul className="space-y-1">
              <li>• Focus on your breath</li>
              <li>• Let thoughts come and go naturally</li>
              <li>• Return attention to breath when distracted</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Meditation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">12</div>
          <div className="text-gray-600">Sessions This Week</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-2">85m</div>
          <div className="text-gray-600">Total Time</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">7</div>
          <div className="text-gray-600">Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default Meditation;