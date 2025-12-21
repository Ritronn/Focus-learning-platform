import React, { useState, useEffect } from 'react';
import { Code, Clock, GitBranch, FileCode, Zap, RefreshCw } from 'lucide-react';
import vscodeService from '../services/vscodeService';

const ProjectTracking = () => {
  const [projects, setProjects] = useState([]);
  const [vsCodeProjects, setVSCodeProjects] = useState([]);

  // Load VS Code projects only once on mount
  useEffect(() => {
    const loadVSCodeProjects = async () => {
      const hasData = await vscodeService.loadFromStorage();
      const vscodeProjects = vscodeService.getProjects();
      setVSCodeProjects(vscodeProjects);
    };

    loadVSCodeProjects();
  }, []);

  // Manual refresh function
  const refreshVSCodeData = async () => {
    const hasData = await vscodeService.loadFromStorage();
    const vscodeProjects = vscodeService.getProjects();
    setVSCodeProjects(vscodeProjects);
  };

  // Mock projects for demo
  const mockProjects = [
    {
      id: 1,
      name: 'E-commerce Website',
      language: 'JavaScript',
      framework: 'React',
      totalTime: '24h 35m',
      todayTime: '2h 15m',
      filesEdited: 47,
      linesAdded: 2340,
      linesDeleted: 890,
      commits: 23,
      lastActive: '2 hours ago',
      progress: 65,
      status: 'active'
    },
    {
      id: 2,
      name: 'Machine Learning Model',
      language: 'Python',
      framework: 'TensorFlow',
      totalTime: '18h 20m',
      todayTime: '1h 45m',
      filesEdited: 32,
      linesAdded: 1850,
      linesDeleted: 420,
      commits: 15,
      lastActive: '5 hours ago',
      progress: 45,
      status: 'active'
    },
    {
      id: 3,
      name: 'REST API Backend',
      language: 'Java',
      framework: 'Spring Boot',
      totalTime: '32h 10m',
      todayTime: '0h 0m',
      filesEdited: 68,
      linesAdded: 3200,
      linesDeleted: 1100,
      commits: 41,
      lastActive: '2 days ago',
      progress: 80,
      status: 'paused'
    },
    {
      id: 4,
      name: 'Mobile App',
      language: 'Dart',
      framework: 'Flutter',
      totalTime: '15h 45m',
      todayTime: '3h 20m',
      filesEdited: 28,
      linesAdded: 1560,
      linesDeleted: 340,
      commits: 18,
      lastActive: '30 minutes ago',
      progress: 35,
      status: 'active'
    }
  ];

  // Combine VS Code projects with mock projects
  const allProjects = [...vsCodeProjects, ...mockProjects];

  const [selectedProject, setSelectedProject] = useState(null);

  const weeklyActivity = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 6.2 },
    { day: 'Wed', hours: 3.8 },
    { day: 'Thu', hours: 7.1 },
    { day: 'Fri', hours: 5.5 },
    { day: 'Sat', hours: 2.3 },
    { day: 'Sun', hours: 1.8 }
  ];

  const getLanguageColor = (language) => {
    const colors = {
      'JavaScript': 'bg-yellow-500',
      'Python': 'bg-blue-500',
      'Java': 'bg-red-500',
      'Dart': 'bg-teal-500'
    };
    return colors[language] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const maxHours = Math.max(...weeklyActivity.map(d => d.hours));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Tracking</h1>
          <p className="text-gray-600">Monitor your coding activity with VS Code integration</p>
        </div>
        <button
          onClick={refreshVSCodeData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* VS Code Integration Status */}
      {vsCodeProjects.length > 0 && (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">VS Code Extension Connected!</h3>
              <p className="text-sm opacity-90">Tracking {vsCodeProjects.length} project(s) in real-time</p>
            </div>
          </div>
        </div>
      )}

      {vsCodeProjects.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3">
            <Code className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">VS Code Extension Not Detected</h3>
              <p className="text-sm text-yellow-700">Install the MindForge VS Code extension to track real coding time</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Code className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold text-gray-800">{allProjects.filter(p => p.status === 'active').length}</span>
          </div>
          <h3 className="font-semibold text-gray-700">Active Projects</h3>
          <p className="text-sm text-gray-500">In progress</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-green-500" />
            <span className="text-2xl font-bold text-gray-800">7.3h</span>
          </div>
          <h3 className="font-semibold text-gray-700">Today's Coding</h3>
          <p className="text-sm text-gray-500">Across all projects</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <GitBranch className="w-8 h-8 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">97</span>
          </div>
          <h3 className="font-semibold text-gray-700">Total Commits</h3>
          <p className="text-sm text-gray-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <FileCode className="w-8 h-8 text-orange-500" />
            <span className="text-2xl font-bold text-gray-800">175</span>
          </div>
          <h3 className="font-semibold text-gray-700">Files Edited</h3>
          <p className="text-sm text-gray-500">This week</p>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Weekly Coding Activity</h2>
        <div className="flex items-end justify-between h-48 space-x-4">
          {weeklyActivity.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(data.hours / maxHours) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                    {data.hours}h
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <div className="text-sm font-medium text-gray-700">{data.day}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Projects</h2>
        <div className="space-y-4">
          {allProjects.length === 0 ? (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Projects Found</h3>
              <p className="text-gray-500">Start coding in VS Code with the Kaizer extension to see your projects here</p>
            </div>
          ) : (
            allProjects.map((project) => (
              <div 
                key={project.id}
                className={`border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${
                  project.isVSCodeProject ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{project.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                      {project.isVSCodeProject && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          VS Code
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center space-x-1">
                        <div className={`w-3 h-3 rounded-full ${getLanguageColor(project.language)}`}></div>
                        <span>{project.language}</span>
                      </span>
                      <span>{project.framework}</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{project.totalTime}</span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Last active: {project.lastActive}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-600">{project.progress}%</div>
                    <div className="text-xs text-gray-500">Complete</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{project.filesEdited}</div>
                    <div className="text-xs text-gray-500">Files</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-green-600">+{project.linesAdded}</div>
                    <div className="text-xs text-gray-500">Lines Added</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-red-600">-{project.linesDeleted}</div>
                    <div className="text-xs text-gray-500">Lines Deleted</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{project.commits}</div>
                    <div className="text-xs text-gray-500">Commits</div>
                  </div>
                </div>
              </div>
            ))
          )}}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedProject.name}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Time</div>
                  <div className="text-2xl font-bold text-gray-800">{selectedProject.totalTime}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Today</div>
                  <div className="text-2xl font-bold text-indigo-600">{selectedProject.todayTime}</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Project Stats</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{selectedProject.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Framework:</span>
                    <span className="font-medium">{selectedProject.framework}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Files Edited:</span>
                    <span className="font-medium">{selectedProject.filesEdited}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commits:</span>
                    <span className="font-medium">{selectedProject.commits}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTracking;