import React from 'react';  // Import React
import Navbar from './Components/Navbar'; // Import Navbar component
import './App.css'; // Optional: Import your styles
import WaterRipple from './Components/WaterRipple';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <WaterRipple />
    </div>
  );
};

export default App;
