import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Projects from './Components/Projects';
import TerminalAbout from './Components/TerminalAbout';
import WaterRippleScreen from './Components/WaterRipple';
import WaterRippleCursor from './Components/WaterRippleCursor';
import LockScreen from './Components/LockScreen';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState("blue");
  const [isUnlocked, setIsUnlocked] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "blue" ? "orange" : "blue"));
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem('isUnlocked', 'true');
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {isUnlocked && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      
      <main className="space-y-20 lg:space-y-32">
        <Routes>
          <Route 
            path="/" 
            element={
              !isUnlocked ? (
                <LockScreen onUnlock={handleUnlock} />
              ) : (
                <Navigate to="/about" />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={isUnlocked ? <Dashboard /> : <Navigate to="/" />} 
          />
          <Route 
            path="/projects" 
            element={isUnlocked ? <Projects /> : <Navigate to="/" />} 
          />
          <Route 
            path="/about" 
            element={isUnlocked ? <TerminalAbout /> : <Navigate to="/" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <WaterRippleScreen theme={theme} />
      <WaterRippleCursor />
    </div>
  );
};

export default App;