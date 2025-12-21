const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

let isTracking = false;
let currentProject = null;
let sessionStart = null;
let totalTime = 0;
let statusBarItem;
let trackingInterval;

function activate(context) {
    console.log('Kaizer Focus Tracker activated');
    
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'kaizer.viewStats';
    context.subscriptions.push(statusBarItem);
    
    // Register commands
    const startCommand = vscode.commands.registerCommand('kaizer.startTracking', startTracking);
    const stopCommand = vscode.commands.registerCommand('kaizer.stopTracking', stopTracking);
    const statsCommand = vscode.commands.registerCommand('kaizer.viewStats', viewStats);
    
    context.subscriptions.push(startCommand, stopCommand, statsCommand);
    
    // Auto-detect project and start tracking
    autoStartTracking();
    
    // Track file changes and typing
    vscode.workspace.onDidChangeTextDocument(onDocumentChange);
    vscode.window.onDidChangeActiveTextEditor(onEditorChange);
    
    updateStatusBar();
}

function autoStartTracking() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        currentProject = workspaceFolders[0].name;
        startTracking();
    }
}

function startTracking() {
    if (isTracking) return;
    
    isTracking = true;
    sessionStart = Date.now();
    
    // Update every second
    trackingInterval = setInterval(() => {
        if (isTracking) {
            totalTime += 1;
            updateStatusBar();
            saveStats();
        }
    }, 1000);
    
    vscode.window.showInformationMessage(`Started tracking project: ${currentProject || 'Unknown'}`);
    updateStatusBar();
}

function stopTracking() {
    if (!isTracking) return;
    
    isTracking = false;
    clearInterval(trackingInterval);
    
    const sessionTime = Math.floor((Date.now() - sessionStart) / 1000);
    saveStats();
    
    vscode.window.showInformationMessage(`Stopped tracking. Session time: ${formatTime(sessionTime)}`);
    updateStatusBar();
}

function onDocumentChange(event) {
    if (!isTracking) return;
    
    // Track active coding (typing)
    const stats = getStats();
    stats.linesChanged = (stats.linesChanged || 0) + event.contentChanges.length;
    stats.lastActivity = Date.now();
    
    // Save locally only
    const statsPath = getStatsFilePath();
    try {
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    } catch (e) {}
    
    // Reset idle timer
    resetIdleTimer();
}

function onEditorChange(editor) {
    if (!isTracking || !editor) return;
    
    // Track file switches
    const stats = getStats();
    stats.filesSwitched = (stats.filesSwitched || 0) + 1;
    stats.currentFile = editor.document.fileName;
    
    // Save locally only
    const statsPath = getStatsFilePath();
    try {
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    } catch (e) {}
    
    // Reset idle timer
    resetIdleTimer();
}

let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if (isTracking) {
            vscode.window.showInformationMessage('Auto-stopped tracking due to inactivity', 'Resume').then(selection => {
                if (selection === 'Resume') {
                    startTracking();
                }
            });
            stopTracking();
        }
    }, 5 * 60 * 1000); // 5 minutes
}

function updateStatusBar() {
    if (!statusBarItem) return;
    
    if (isTracking) {
        const sessionTime = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
        statusBarItem.text = `$(clock) MindForge: ${formatTime(sessionTime)}`;
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
    } else {
        statusBarItem.text = `$(clock) MindForge: Stopped`;
        statusBarItem.backgroundColor = undefined;
    }
    
    statusBarItem.show();
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
}

function getStatsFilePath() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (workspaceFolders && workspaceFolders.length > 0) {
        return path.join(workspaceFolders[0].uri.fsPath, '.kaizer-stats.json');
    }
    return path.join(require('os').homedir(), '.kaizer-stats.json');
}

function getStats() {
    try {
        const statsPath = getStatsFilePath();
        if (fs.existsSync(statsPath)) {
            return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading stats:', error);
    }
    
    return {
        projectName: currentProject || 'Unknown',
        totalTime: 0,
        sessionsCount: 0,
        linesChanged: 0,
        filesSwitched: 0,
        lastSession: null,
        createdAt: Date.now()
    };
}

function saveStats() {
    const stats = getStats();
    const sessionTime = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
    
    stats.totalTime = (stats.totalTime || 0) + 1;
    stats.lastSession = sessionTime;
    stats.lastActivity = Date.now();
    
    // Save to project file every second (local tracking)
    const statsPath = getStatsFilePath();
    try {
        fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    } catch (e) {}
    
    // Save for web app only every 60 seconds
    if (!stats.lastWebSave || Date.now() - stats.lastWebSave > 60000) {
        stats.lastWebSave = Date.now();
        saveForWebApp(stats);
    }
}

function saveForWebApp(stats) {
    const webData = {
        project: currentProject,
        stats: stats,
        isTracking: isTracking,
        timestamp: Date.now()
    };
    
    // Save only to home directory (outside React project)
    const webPath = path.join(require('os').homedir(), '.kaizer-vscode.json');
    try {
        fs.writeFileSync(webPath, JSON.stringify(webData, null, 2));
    } catch (e) {}
}



function sendToWebApp(stats) {
    // Simple HTTP request to localhost:3000 (if running)
    const http = require('http');
    
    const data = JSON.stringify({
        type: 'vscode_stats',
        project: currentProject,
        stats: stats,
        isTracking: isTracking
    });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/vscode-stats',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
    
    const req = http.request(options, (res) => {
        // Silent success
    });
    
    req.on('error', (err) => {
        // Silent fail - web app might not be running
    });
    
    req.write(data);
    req.end();
}

function viewStats() {
    const stats = getStats();
    const sessionTime = sessionStart ? Math.floor((Date.now() - sessionStart) / 1000) : 0;
    
    const message = `
📊 Kaizer Coding Stats
Project: ${stats.projectName}
Total Time: ${formatTime(stats.totalTime || 0)}
Current Session: ${formatTime(sessionTime)}
Lines Changed: ${stats.linesChanged || 0}
Files Switched: ${stats.filesSwitched || 0}
Status: ${isTracking ? 'Tracking' : 'Stopped'}
    `.trim();
    
    vscode.window.showInformationMessage(message, 'Open Kaizer App').then(selection => {
        if (selection === 'Open Kaizer App') {
            vscode.env.openExternal(vscode.Uri.parse('http://localhost:3000/projects'));
        }
    });
}

function deactivate() {
    if (isTracking) {
        stopTracking();
    }
}

module.exports = {
    activate,
    deactivate
};