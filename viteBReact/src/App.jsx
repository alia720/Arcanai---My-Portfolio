import React from 'react';  // Import React
import Navbar from './Components/Navbar'; // Import Navbar component
import './App.css'; // Optional: Import your styles

const App = () => {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div style={{ padding: "20px" }}>
        <h1>Welcome to my App!</h1>
        <p>This is the content of the app.</p>
      </div>
    </div>
  );
};

export default App;
