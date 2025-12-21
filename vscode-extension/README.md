# Kaizer Focus Tracker - VS Code Extension

Track your coding time and productivity directly in VS Code.

## Features

### ✅ Implemented
- **Auto Project Detection**: Automatically starts tracking when you open a project
- **Real-time Tracking**: Shows live coding time in status bar
- **Activity Monitoring**: Tracks lines changed, files switched
- **Session Management**: Start/stop tracking manually
- **Stats Persistence**: Saves stats to `.kaizer-stats.json` in project folder
- **Web App Integration**: Sends data to Kaizer dashboard (if running)

### 📊 Tracked Metrics
- Total coding time per project
- Current session duration
- Lines of code changed
- File switches
- Last activity timestamp

## Installation

### Method 1: Load Unpacked (Development)
1. Open VS Code
2. Press `Ctrl+Shift+P` → "Extensions: Install from VSIX"
3. Or go to Extensions → "..." → "Install from VSIX"
4. Select the `vscode-extension` folder

### Method 2: Manual Install
1. Copy `vscode-extension` folder to:
   - **Windows**: `%USERPROFILE%\.vscode\extensions\`
   - **Mac**: `~/.vscode/extensions/`
   - **Linux**: `~/.vscode/extensions/`
2. Restart VS Code

## Usage

### Commands (Ctrl+Shift+P)
- `Kaizer: Start Project Tracking` - Begin tracking
- `Kaizer: Stop Project Tracking` - Stop tracking  
- `Kaizer: View Coding Stats` - Show current stats

### Status Bar
- Shows live tracking time: `⏰ Kaizer: 15m 30s`
- Click to view detailed stats
- Green background when actively tracking

### Auto-Tracking
- Automatically starts when you open a workspace
- Tracks typing, file switches, and time spent
- Saves stats every second to `.kaizer-stats.json`

## Integration with Kaizer App

The extension automatically sends stats to your Kaizer dashboard at `http://localhost:3000` if it's running.

### Stats Format
```json
{
  "projectName": "My Project",
  "totalTime": 3600,
  "sessionsCount": 5,
  "linesChanged": 150,
  "filesSwitched": 12,
  "lastActivity": 1640995200000
}
```

## File Structure
```
vscode-extension/
├── package.json       # Extension manifest
├── extension.js       # Main extension code
└── README.md         # This file
```

## Development Notes

Built in ~30 minutes focusing on core functionality:
- Real-time tracking with 1-second precision
- Automatic project detection
- Persistent stats storage
- Web app integration via HTTP requests
- Clean status bar integration

## Future Enhancements
- Language-specific tracking
- Git integration (commits, branches)
- Advanced productivity metrics
- Team collaboration features
- Custom tracking rules