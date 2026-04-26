// VS Code Extension Data Service
class VSCodeService {
  constructor() {
    this.projects = new Map();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen for VS Code extension data
    window.addEventListener('vscode-stats-update', (event) => {
      this.updateProjectData(event.detail);
    });
  }

  updateProjectData(data) {
    const projectName = data.project || 'Unknown Project';
    this.projects.set(projectName, {
      ...data,
      lastUpdated: Date.now()
    });
  }

  getProjects() {
    const projectList = [];
    
    this.projects.forEach((data, name) => {
      projectList.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        language: this.detectLanguage(data.stats?.currentFile || '') || 'JavaScript',
        framework: this.detectFramework(name) || 'React',
        totalTime: this.formatTime(data.stats?.totalTime || 0),
        todayTime: this.formatTime(data.stats?.lastSession || 0),
        filesEdited: Math.max(1, data.stats?.filesSwitched || 0), // At least 1
        linesAdded: Math.max(10, data.stats?.linesChanged || 0), // At least 10
        linesDeleted: Math.floor((data.stats?.linesChanged || 0) * 0.3), // 30% of lines added
        commits: Math.max(1, Math.floor((data.stats?.totalTime || 0) / 1800)), // 1 commit per 30 min
        lastActive: this.getLastActive(data.stats?.lastActivity),
        progress: Math.min(100, Math.max(5, Math.floor((data.stats?.totalTime || 0) / 3600 * 10))), // At least 5%
        status: data.isTracking ? 'active' : 'paused',
        isVSCodeProject: true
      });
    });

    return projectList;
  }

  detectFramework(projectName) {
    const name = projectName.toLowerCase();
    if (name.includes('react') || name.includes('focus-learning')) return 'React';
    if (name.includes('vue')) return 'Vue.js';
    if (name.includes('angular')) return 'Angular';
    if (name.includes('next')) return 'Next.js';
    if (name.includes('node') || name.includes('api')) return 'Node.js';
    if (name.includes('django')) return 'Django';
    if (name.includes('flask')) return 'Flask';
    return 'React'; // Default for web projects
  }

  detectLanguage(filePath) {
    if (!filePath) return 'JavaScript'; // Default for web projects
    
    const ext = filePath.split('.').pop()?.toLowerCase();
    const langMap = {
      'js': 'JavaScript',
      'jsx': 'JavaScript', 
      'ts': 'TypeScript',
      'tsx': 'TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust',
      'dart': 'Dart',
      'kt': 'Kotlin',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON'
    };
    
    return langMap[ext] || 'JavaScript'; // Default to JavaScript instead of Unknown
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  getLastActive(timestamp) {
    if (!timestamp) return 'Never';
    
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }

  // Load from localStorage and file system
  async loadFromStorage() {
    try {
      // Try localStorage first
      const stored = localStorage.getItem('vscode-projects');
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([name, projectData]) => {
          this.projects.set(name, projectData);
        });
      }
      
      // Also try to read from file system
      const hasFileData = await this.loadFromFileSystem();
      return hasFileData || this.projects.size > 0;
    } catch (e) {
      console.error('Error loading VS Code projects:', e);
      return false;
    }
  }

  // Load from API server
  async loadFromFileSystem() {
    try {
      const response = await fetch('http://localhost:3001/api/vscode-data');
      if (response.ok) {
        const data = await response.json();
        if (data.project) {
          this.updateProjectData(data);
          return true;
        }
      }
    } catch (e) {
      // API server not running
    }
    return false;
  }

  // Check for .kaizer-stats.json files (if user shares project folder)
  async checkForStatsFiles() {
    // This would require file system access - simplified for now
    return [];
  }
}

const vscodeServiceInstance = new VSCodeService();
export default vscodeServiceInstance;