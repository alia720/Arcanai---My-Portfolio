// src/Components/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const AnimatedEye = () => {
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
    <div 
      ref={eyeRef}
      className="relative h-12 w-12 rounded-full border-2 border-purple-400/30 
                 backdrop-blur-xl overflow-hidden cursor-pointer hover:scale-105 
                 transition-transform duration-300 bg-gradient-to-br from-purple-900/40 
                 to-cyan-900/30"
    >
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(202,234,245,0.2)_0%,_transparent_60%)] 
                        animate-spin-slow opacity-50" />
      </div>
      <div
        ref={pupilRef}
        className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full 
                   transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2
                   border border-cyan-400/30"
      >
        <div className="absolute top-1 left-1 w-2 h-2 bg-cyan-300 rounded-full 
                        shadow-[0_0_6px_2px_rgba(34,211,238,0.3)]" />
        <div className="absolute bottom-1 right-1 w-1 h-1 bg-purple-400 rounded-full 
                        shadow-[0_0_4px_1px_rgba(168,85,247,0.2)]" />
      </div>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,_transparent_0px,_transparent_5px,_rgba(168,85,247,0.1)_5px,_rgba(168,85,247,0.1)_6px)] 
                      opacity-30 mix-blend-overlay" />
      <div className="absolute inset-0 rounded-full border border-cyan-400/20 
                      pointer-events-none shadow-[inset_0_0_12px_2px_rgba(34,211,238,0.15)]" />
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    // You can add more routes as needed
  ];

  return (
    <>
      <nav className="w-full fixed top-0 left-0 right-0 z-50">
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-400/0 via-cyan-300/80 to-blue-400/0 animate-pulse" />
        
        <div className="flex justify-between items-center py-4 px-6 backdrop-blur-xl bg-gradient-to-b from-blue-900/30 to-indigo-900/20 border-b border-sky-500/20">
          <AnimatedEye />

          <div className="hidden lg:flex w-full justify-center">
            <ul className="flex gap-x-12 font-light tracking-widest text-lg">
              {navItems.map((item) => (
                <li key={item.path} className="relative py-2 group">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `inline-block relative no-underline transform transition-all duration-300 ${
                        isActive ? 'text-cyan-300' : 'text-white'
                      } group-hover:-translate-y-0.5`
                    }
                  >
                    <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent relative z-10">
                      {item.label}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="absolute -top-2 -left-1 w-1 h-1 bg-cyan-400 rounded-full animate-float" />
                        <span className="absolute -top-1 -right-2 w-1 h-1 bg-purple-400 rounded-full animate-float-delay" />
                      </span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-400/80 to-purple-400/80 group-hover:w-full transition-all duration-300" />
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg backdrop-blur-sm bg-cyan-900/20 hover:bg-cyan-900/30 transition-colors"
          >
            <div className={`w-6 h-6 relative transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
              <div className={`absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 ${isOpen ? 'rotate-45 top-1/2' : 'top-1/3'}`} />
              <div className={`absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 ${isOpen ? 'opacity-0' : 'top-1/2'}`} />
              <div className={`absolute h-[2px] w-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300 ${isOpen ? '-rotate-45 top-1/2' : 'top-2/3'}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden bg-gradient-to-b from-blue-900/60 to-indigo-900/40 backdrop-blur-lg overflow-hidden transition-all duration-500 ease-out-quad ${
          isOpen ? 'max-h-96 py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
        }`}>
          <div className="flex flex-col gap-y-8 items-center py-4">
            {navItems.map((item, index) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className="text-lg font-light tracking-wider opacity-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-20" />

      <style jsx global>{`
        @keyframes hologramAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-shadow {
          0% { box-shadow: 0 0 8px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
          100% { box-shadow: 0 0 8px rgba(34, 211, 238, 0.3); }
        }
        @keyframes float {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-10px) scale(0.8); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 1.5s infinite linear; }
        .animate-float-delay { animation: float 1.5s infinite linear 0.5s; }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-pulse-shadow { animation: pulse-shadow 2s infinite; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
    </>
  );
};

export default Navbar;
