import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

// Eye Component
const AnimatedEye = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (eyeRef.current && pupilRef.current) {
        const eyeRect = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const maxDistance = eyeRect.width * 0.15;
        
        pupilRef.current.style.transform = `translate(
          ${Math.cos(angle) * maxDistance}px, 
          ${Math.sin(angle) * maxDistance}px
        )`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={eyeRef} className="relative h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400/80 to-blue-600/80 border-2 border-cyan-300/30 backdrop-blur-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300">
      <div ref={pupilRef} className="absolute top-1/2 left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out">
        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white/90 rounded-full" />
      </div>
      <div className="absolute inset-0 opacity-40 mix-blend-overlay animate-spin-slow" 
           style={{ background: `repeating-radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 15%)` }} />
    </div>
  );
};

// Navbar Component
const SciFiNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 z-50">
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-400/0 via-cyan-300/80 to-blue-400/0 animate-pulse" />
        <div className="flex justify-between items-center py-3 px-6 backdrop-blur-xl bg-gradient-to-b from-cyan-900/20 to-blue-900/10 border-b border-cyan-400/20">
          
          <AnimatedEye />

          <div className="hidden lg:flex gap-x-8">
            {['Dashboard', 'Systems', 'Sensors', 'Settings'].map((item) => (
              <button key={item} className="group relative text-lg font-light tracking-wider">
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent relative z-10">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </span>
                <span className="absolute -bottom-2 left-1/2 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-1/2" />
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg backdrop-blur-sm bg-cyan-900/20 hover:bg-cyan-900/30 transition-colors"
          >
            <div className={`w-6 h-6 relative transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
              <div className={`absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${isOpen ? 'rotate-45 top-1/2' : 'top-1/3'}`} />
              <div className={`absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-1/2'}`} />
              <div className={`absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300 ${isOpen ? '-rotate-45 top-1/2' : 'top-2/3'}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-gradient-to-b from-cyan-900/40 to-blue-900/20 backdrop-blur-xl overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-96 py-4' : 'max-h-0'}`}>
          <div className="flex flex-col gap-y-6 items-center pt-4">
            {['Dashboard', 'Systems', 'Sensors', 'Settings'].map((item, index) => (
              <button 
                key={item} 
                className="text-lg font-light tracking-wider opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-20" />

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.3; }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse { animation: pulse 2s infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

// Water Ripple Component (Your original code with responsive fixes)
const WaterRippleScreen = () => {
  // ... (Use the water ripple code I provided earlier with responsive fixes)
};

// Main Component
export default function SciFiInterface() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900/50 to-indigo-900/30">
      <SciFiNavbar />
      <WaterRippleScreen />
      
      {/* Example Content */}
      <div className="relative z-10 pt-24 px-8 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-4">
          Holographic Interface
        </h1>
        <p className="text-cyan-200/80 text-lg max-w-2xl mx-auto">
          Next-generation control panel with fluid dynamics visualization
        </p>
      </div>
    </div>
  );
}