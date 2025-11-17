# Pomodoro Timer

A customizable Pomodoro Timer application built with React that helps you manage your work and break intervals using the Pomodoro Technique.

## Features

- **Customizable Timer**: Adjust work and break durations using intuitive sliders (1-120 minutes)
- **Profile Management**: Create, edit, and save multiple timer profiles for different scenarios (studying, coding, reading, etc.)
- **Visual Progress**: Circular progress bar with color-coded display (red for work sessions, green for breaks)
- **Break Celebrations**: Congratulatory modal with confetti animation and audio chime when completing work sessions
- **Fullscreen Mode**: Distraction-free fullscreen option for better focus
- **Persistent Settings**: Your preferences and profiles are automatically saved to localStorage
- **Default Settings**: Quickly reset to default 45-minute work / 15-minute break intervals

## Getting Started

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### Building for Production

```bash
npm run build
```

## How to Use

1. **Start a Session**: Click the play button to begin your work timer
2. **Pause/Resume**: Use the pause button to temporarily stop the timer
3. **Adjust Settings**: Click the settings gear icon to customize work and break durations
4. **Create Profiles**: Click the profiles icon to create custom timer presets for different tasks
5. **Fullscreen**: Click the fullscreen button for an immersive, distraction-free experience

## Technologies Used

- React
- React Context API for state management
- rc-slider for custom range sliders
- react-circular-progressbar for timer visualization
- canvas-confetti for celebration effects
- localStorage for data persistence

## Project Structure

- `Timer.js` - Main timer component with countdown logic
- `Settings.js` - Timer configuration interface
- `Profiles.js` - Profile management interface
- `BreakModal.js` - Celebration modal displayed after work sessions
- `SettingsContext.js` - Global state management

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
