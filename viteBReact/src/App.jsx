// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Dashboard from './Components/Dashboard';
import Projects from './Components/Projects';
import TerminalAbout from './Components/TerminalAbout';
import WaterRipple from './Components/WaterRipple';
import './App.css';

const App = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <Navbar />
      <main className="space-y-20 lg:space-y-32">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<TerminalAbout />} />
          {/* Redirect any unknown routes to the home page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <WaterRipple /> {/* Background effect */}
    </div>
  );
};

export default App;
