import React, { useState, useEffect } from 'react';
import { Shield, Clock, Target, X } from 'lucide-react';

const FocusOverlay = ({ blockedSites, studyMode, onEndStudy }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    // Simulate checking current URL (in real implementation, this would be handled by browser extension)
    const checkUrl = () => {
      const url = window.location.hostname;
      const isBlocked = blockedSites.some(site => url.includes(site.replace('www.', '')));
      
      if (isBlocked) {
        setCurrentUrl(url);
        setShowOverlay(true);
      }
    };

    // Check every second
    const interval = setInterval(checkUrl, 1000);
    return () => clearInterval(interval);
  }, [blockedSites]);

  // Simulate blocked site detection for demo
  useEffect(() => {
    // For demo purposes, show overlay after 10 seconds to simulate visiting a blocked site
    const demoTimer = setTimeout(() => {
      if (blockedSites.length > 0) {
        setCurrentUrl('facebook.com');
        setShowOverlay(true);
      }
    }, 10000);

    return () => clearTimeout(demoTimer);
  }, [blockedSites]);

  if (!showOverlay || blockedSites.length === 0) return null;

  return (
    <div className="focus-overlay">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
        <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Stay Focused!</h2>
        
        <p className="text-gray-600 mb-6">
          You're trying to access <strong>{currentUrl}</strong> during your {studyMode?.name} session.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Mode: {studyMode?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{studyMode?.duration} min session</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowOverlay(false)}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Return to Study
          </button>
          
          <button
            onClick={() => {
              setShowOverlay(false);
              onEndStudy();
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>End Study Session</span>
          </button>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>💡 Tip: Close distracting tabs before starting your study session</p>
        </div>
      </div>
    </div>
  );
};

export default FocusOverlay;