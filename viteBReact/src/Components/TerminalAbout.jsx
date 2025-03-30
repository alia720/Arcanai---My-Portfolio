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
  "databases": ["PostgreSQL", "FastDB"],
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
      url: '/ali-alyasseen-resume.pdf' // Update this path to match your actual resume file
    },
    { type: 'command', text: 'exit' },
    { type: 'response', text: 'Session maintained - Terminal ready for collaboration opportunities' },
  ];

  // Typing effect
  useEffect(() => {
    if (currentIndex < terminalContent.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => [...prev, terminalContent[currentIndex]]);
        setCurrentIndex(prevIndex => prevIndex + 1);
        
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, terminalContent[currentIndex].type === 'command' ? 1000 : 400);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Render different types of content
  const renderContent = (item, index) => {
    switch (item.type) {
      case 'command':
        return (
          <div className="mt-2" key={index}>
            <span className="text-green-400">user@portfolio</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>
            <span className="ml-2 text-gray-200">{item.text}</span>
          </div>
        );
      case 'response':
        return <div className="text-gray-400 ml-0" key={index}>{item.text}</div>;
      case 'header':
        return (
          <div className="mt-4 mb-2" key={index}>
            <div className="text-cyan-300 font-mono border-b border-cyan-800/50 pb-1 mb-2">
              === {item.text} ===
            </div>
          </div>
        );
      case 'info':
        return <div className="text-gray-300 ml-4" key={index}>{item.text}</div>;
      case 'code':
        return (
          <pre className="bg-gray-900/50 p-3 rounded border border-gray-700/50 text-gray-300 font-mono text-sm mt-2 mb-2 overflow-x-auto" key={index}>
            {item.text}
          </pre>
        );
      case 'paragraph':
        return <p className="text-gray-300 mt-1 mb-2" key={index}>{item.text}</p>;
      case 'link':
        return (
          <a
            href={item.url}
            className="ml-4 text-cyan-300 hover:text-cyan-200 transition-colors underline"
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

  return (
    <section className="py-16 px-6 relative z-10">
      <div className="h-[2px] w-full max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-400/0 via-cyan-300/80 to-blue-400/0 animate-pulse" />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-lg overflow-hidden border border-gray-700/50">
          <div className="flex items-center bg-gray-800/80 px-4 py-2 border-b border-gray-700/50">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="mx-auto text-xs text-gray-400 font-mono">
              ali-alyasseen.sh - Terminal
            </div>
          </div>
          
          <div 
            ref={terminalRef}
            className="p-4 font-mono text-sm h-96 overflow-y-auto text-left"
            style={{ backgroundColor: 'rgba(20, 25, 40, 0.7)' }}
          >
            {displayText.map((item, index) => renderContent(item, index))}
            
            {currentIndex < terminalContent.length && (
              <span className={`inline-block w-2 h-4 bg-gray-300 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalAbout;