import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Focus, 
  BookOpen, 
  BarChart3, 
  BookMarked, 
  Code, 
  Brain,
  Menu,
  X
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/study-modes', icon: Focus, label: 'Study Modes' },
    { path: '/courses', icon: BookOpen, label: 'Courses' },
    { path: '/browser-stats', icon: BarChart3, label: 'Browser Stats' },
    { path: '/daily-reading', icon: BookMarked, label: 'Daily Reading' },
    { path: '/projects', icon: Code, label: 'Projects' },
    { path: '/meditation', icon: Brain, label: 'Meditation' }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Focus className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800">MindForge</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-100 text-indigo-700 border-r-4 border-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isCollapsed && (
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg px-3 py-2 text-white flex items-center space-x-2">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-semibold">7</span>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="absolute top-16 left-2">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-full w-8 h-8 flex items-center justify-center text-white">
            <span className="text-sm">🔥</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;