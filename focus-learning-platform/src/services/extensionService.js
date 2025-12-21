/* global chrome */
// Browser Extension Communication Service
class ExtensionService {
  constructor() {
    this.isConnected = false;
    this.stats = { tabSwitches: 0, attentionScore: 100, sessionTime: 0, studyMode: 'basic', isExtensionActive: false };
    this.setupEventListener();
    this.loadFromStorage();
  }

  // Listen for extension updates
  setupEventListener() {
    window.addEventListener('extensionStatsUpdate', (event) => {
      this.stats = event.detail;
      this.isConnected = true;
    });
  }

  // Load stats from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('extensionStats');
      if (stored) {
        this.stats = JSON.parse(stored);
        this.isConnected = true;
      }
    } catch (e) {}
  }

  // Check if extension is installed
  async checkExtension() {
    this.loadFromStorage();
    return this.stats;
  }

  // Get real-time stats
  async getStats() {
    this.loadFromStorage();
    return this.stats;
  }

  // Mock stats when extension is not available
  getMockStats() {
    return {
      tabSwitches: 0,
      attentionScore: 100,
      sessionTime: 0,
      studyMode: 'basic',
      isExtensionActive: false
    };
  }

  // Reset session (simplified)
  async resetSession() {
    localStorage.removeItem('extensionStats');
    this.stats = { tabSwitches: 0, attentionScore: 100, sessionTime: 0, studyMode: 'basic', isExtensionActive: false };
    return true;
  }

  // Update settings (simplified)
  async updateExtensionSettings(settings) {
    return true;
  }
}

export default new ExtensionService();