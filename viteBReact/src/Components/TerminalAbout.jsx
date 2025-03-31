// src/Components/TerminalAbout.jsx
import React, { useState, useEffect, useRef } from 'react';

const TerminalAbout = () => {
  const [displayText, setDisplayText] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const terminalRef = useRef(null);
  
  const terminalContent = [
    { type: 'command', text: 'sudo access --profile ali-alyasseen' },
    { type: 'response', text: 'Access granted. Loading developer profile...' },
    { type: 'response', text: 'Decrypting academic records...' },
    { type: 'header', text: 'ACADEMIC PROFILE' },
    { type: 'info', text: 'Name: Ali Al Yasseen' },
    { type: 'info', text: 'Institution: University of Calgary' },
    { type: 'info', text: 'Program: B.Sc Computer Science (Exp. 2026)' },
    { type: 'info', text: 'Status: Available for internships' },
    { type: 'command', text: 'cat skills.json' },
    { type: 'code', text: `{
  "languages": ["C", "Assembly", "Python", "TypeScript", "Java", "JavaScript"],
  "frameworks": ["React", "Node.js", "Svelte", "PyQt6", "Tailwind CSS"],
  "systems": ["Linux", "Docker", "TCP Socket Programming", "Real-Time Systems"],
  "databases": ["PostgreSQL", "SQL", "FastDB"],
  "tools": ["Git/GitHub", "Make", "REST API Development", "Web Scraping"]
}` },
    { type: 'command', text: 'cat experience.txt' },
    { type: 'paragraph', text: 'Schulich Ignite (Google IgniteCS) | Feb 2025 - May 2025' },
    { type: 'paragraph', text: '• Taught Python fundamentals to 6+ students using Processing.py' },
    { type: 'paragraph', text: '• Developed interactive coding exercises and grading rubrics' },
    { type: 'paragraph', text: '• Collaborated on curriculum development and lesson planning' },
    { type: 'command', text: 'cat contact.sh' },
    { type: 'info', text: 'Email: ali.alyasseen@ucalgary.ca' },
    { type: 'info', text: 'GitHub: github.com/alia720' },
    { type: 'info', text: 'LinkedIn: linkedin.com/in/ali-al-yasseen-b76a15250' },
    { type: 'info', text: 'Phone: (587) 500-4117' },
    { type: 'command', text: 'download resume.pdf' },
    { type: 'response', text: 'Initiating secure download...' },
    { 
      type: 'link',
      text: '📄 Download Full Resume (PDF)',
      url: '/ali-alyasseen-resume.pdf'
    },
    { type: 'command', text: 'exit' },
    { type: 'response', text: 'Session maintained - Terminal ready for collaboration opportunities' },
  ];

  useEffect(() => {
    if (currentIndex < terminalContent.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => [...prev, terminalContent[currentIndex]]);
        setCurrentIndex(prevIndex => prevIndex + 1);
        
        // Scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, terminalContent[currentIndex].type === 'command' ? 1800 : 1200);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  const renderContent = (item, index) => {
    const glitchClass = "hover:animate-pulse transition-all duration-300";
    
    switch (item.type) {
      case 'command':
        return (
          <div className={`mt-2 ${glitchClass}`} key={index}>
            <span className="text-teal-300">user@hologram</span>
            <span className="text-cyan-100">:</span>
            <span className="text-blue-300">~</span>
            <span className="text-cyan-100">$</span>
            <span className="ml-2 text-cyan-200">
              {item.text}
            </span>
          </div>
        );
      case 'response':
        return (
          <div className={`text-teal-200/80 ml-0 ${glitchClass}`} key={index}>
            {item.text}
          </div>
        );
      case 'header':
        return (
          <div className="mt-4 mb-2" key={index}>
            <div className={`text-cyan-300 font-mono border-b border-cyan-500/30 pb-1 mb-2 ${glitchClass}`}>
              === {item.text} ===
            </div>
          </div>
        );
      case 'info':
        return (
          <div className={`text-cyan-100/90 ml-4 ${glitchClass}`} key={index}>
            {item.text}
          </div>
        );
      case 'code':
        return (
          <pre className={`bg-blue-900/20 p-3 rounded border border-cyan-900/40 text-cyan-200/90 font-mono text-sm mt-2 mb-2 overflow-x-auto backdrop-blur-md ${glitchClass}`} key={index}>
            {item.text}
          </pre>
        );
      case 'paragraph':
        return (
          <p className={`text-teal-100/90 mt-1 mb-2 ${glitchClass}`} key={index}>
            {item.text}
          </p>
        );
      case 'link':
        return (
          <a
            href={item.url}
            className={`ml-4 text-blue-300 hover:text-cyan-200 transition-colors underline ${glitchClass}`}
            target="_blank"
            rel="noopener noreferrer"
            key={index}
          >
            {item.text}
          </a>
        );
      default:
        return <div key={index}>{item.text}</div>;
    }
  };

  const terminalGlow = "shadow-[0_0_30px_rgba(45,212,191,0.15)] animate-pulse";

  return (
    <section className="py-16 px-6 relative z-10 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
      
      <div className="h-[2px] w-full max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-400/0 via-teal-300/60 to-blue-400/0 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className="absolute h-[2px] w-full bg-cyan-400/20 animate-scanline" style={{ animationDuration: '4s' }}></div>
        </div>
        
        <div className={`bg-gray-900/30 backdrop-blur-xl rounded-lg overflow-hidden border border-cyan-500/20 ${terminalGlow}`}>
          <div className="flex items-center bg-gray-800/40 backdrop-blur-xl px-4 py-2 border-b border-cyan-800/30">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="mx-auto text-xs text-cyan-300/90 font-mono tracking-widest">
              HOLOGRAPHIC-TERMINAL::v3.25
            </div>
          </div>
          
          <div 
            ref={terminalRef}
            className="p-4 font-mono text-sm h-96 overflow-y-auto text-left relative"
            style={{ 
              backgroundColor: 'rgba(10, 25, 50, 0.4)',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.03) 0%, transparent 80%)'
            }}
          >
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`h-${i}`} className="h-px w-full bg-cyan-500/5"></div>
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`v-${i}`} className="w-px h-full bg-cyan-500/5"></div>
              ))}
            </div>
            
            {displayText.map((item, index) => renderContent(item, index))}
            
            {/* Removed the blinking cursor span */}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(1000%); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TerminalAbout;
