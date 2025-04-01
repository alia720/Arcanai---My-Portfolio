import React, { useEffect, useState } from 'react';

const WaterRippleCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
      className="w-6 h-6 rounded-full border border-white animate-[ripple_1.5s_ease-out_infinite]"
    />
  );
};

export default WaterRippleCursor;
