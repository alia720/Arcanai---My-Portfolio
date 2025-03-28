import React from 'react';  // Import React
import Navbar from './Components/Navbar'; // Import Navbar component
import './App.css';
import WaterRipple from './Components/WaterRipple';

const App = () => {
  return (
    <div style={{margin: 0, padding: 0 }}>
      <Navbar/>
      <WaterRipple />
    </div>
  );
};

export default App;
