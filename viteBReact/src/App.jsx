// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Projects from './Components/Projects';
import TerminalAbout from './Components/TerminalAbout';
import WaterRippleScreen from './Components/WaterRipple';
import WaterRippleCursor from './Components/WaterRippleCursor';
import './App.css';

const App = () => {
  const [theme, setTheme] = useState("blue");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "blue" ? "orange" : "blue"));
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="space-y-20 lg:space-y-32">
        <Routes>
          <Route path="/" element={<TerminalAbout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<TerminalAbout />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      {/* Render the water ripple background */}
      <WaterRippleScreen theme={theme} />
      {/* Render the custom water ripple cursor on top */}
      <WaterRippleCursor />
    </div>
  );
};

export default App;
