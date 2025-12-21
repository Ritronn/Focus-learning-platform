import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserPreferenceForm from './components/UserPreferenceForm';
import Dashboard from './components/Dashboard';
import StudyModes from './components/StudyModes';
import Courses from './components/Courses';
import BrowserStats from './components/BrowserStats';
import DailyReading from './components/DailyReading';
import ProjectTracking from './components/ProjectTracking';
import Meditation from './components/Meditation';
import Sidebar from './components/Sidebar';
import FocusOverlay from './components/FocusOverlay';

function App() {
  const [userPreferences, setUserPreferences] = useState(null);
  const [currentStudyMode, setCurrentStudyMode] = useState(null);
  const [isStudyActive, setIsStudyActive] = useState(false);
  const [blockedSites, setBlockedSites] = useState([]);

  // Check if user has completed preferences
  useEffect(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      setUserPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  // Tab switching detection
  useEffect(() => {
    let tabSwitchCount = 0;
    let lastActiveTime = Date.now();

    const handleVisibilityChange = () => {
      if (isStudyActive && document.hidden) {
        tabSwitchCount++;
        const currentTime = Date.now();
        const timeAway = currentTime - lastActiveTime;
        
        // Store tab switch data
        const tabSwitchData = JSON.parse(localStorage.getItem('tabSwitchData') || '[]');
        tabSwitchData.push({
          timestamp: currentTime,
          timeAway: timeAway,
          mode: currentStudyMode?.name || 'Unknown'
        });
        localStorage.setItem('tabSwitchData', JSON.stringify(tabSwitchData));
        
        // Show warning for medium/ultra modes
        if (currentStudyMode?.restrictions?.tabSwitchWarning && tabSwitchCount > 2) {
          alert('Stay focused! You\'ve switched tabs multiple times. Return to your study session.');
        }
      }
      
      if (!document.hidden) {
        lastActiveTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isStudyActive, currentStudyMode]);

  // Website blocking
  useEffect(() => {
    if (isStudyActive && currentStudyMode?.restrictions?.blockedSites) {
      setBlockedSites(currentStudyMode.restrictions.blockedSites);
    } else {
      setBlockedSites([]);
    }
  }, [isStudyActive, currentStudyMode]);

  const handlePreferencesSubmit = (preferences) => {
    setUserPreferences(preferences);
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  };

  const startStudySession = (mode) => {
    setCurrentStudyMode(mode);
    setIsStudyActive(true);
  };

  const endStudySession = () => {
    setCurrentStudyMode(null);
    setIsStudyActive(false);
    setBlockedSites([]);
  };

  // Show preference form if not completed
  if (!userPreferences) {
    return <UserPreferenceForm onSubmit={handlePreferencesSubmit} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  userPreferences={userPreferences}
                  onStartStudy={startStudySession}
                  isStudyActive={isStudyActive}
                  currentStudyMode={currentStudyMode}
                  onEndStudy={endStudySession}
                />
              } 
            />
            <Route 
              path="/study-modes" 
              element={
                <StudyModes 
                  onStartStudy={startStudySession}
                  currentStudyMode={currentStudyMode}
                  isStudyActive={isStudyActive}
                  onEndStudy={endStudySession}
                />
              } 
            />
            <Route path="/courses" element={<Courses userPreferences={userPreferences} />} />
            <Route path="/browser-stats" element={<BrowserStats />} />
            <Route path="/daily-reading" element={<DailyReading userPreferences={userPreferences} />} />
            <Route path="/projects" element={<ProjectTracking />} />
            <Route path="/meditation" element={<Meditation />} />
          </Routes>
        </main>
        
        {/* Focus Overlay for website blocking */}
        {blockedSites.length > 0 && (
          <FocusOverlay 
            blockedSites={blockedSites}
            studyMode={currentStudyMode}
            onEndStudy={endStudySession}
          />
        )}
      </div>
    </Router>
  );
}

export default App;