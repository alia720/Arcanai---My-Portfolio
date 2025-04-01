import React, { useState, useEffect, useRef } from 'react';

const TerminalAbout = () => {
  const savedState = JSON.parse(localStorage.getItem('terminalState'));
  
  const [inputValue, setInputValue] = useState('');
  const [displayedContent, setDisplayedContent] = useState(savedState?.displayedContent || []);
  const [currentIndex, setCurrentIndex] = useState(savedState?.currentIndex || 0);
  const [isTypingComplete, setIsTypingComplete] = useState(savedState?.isTypingComplete || false);
  const [commandHistory, setCommandHistory] = useState(savedState?.commandHistory || []);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentTheme, setCurrentTheme] = useState(savedState?.currentTheme || 'cyberpunk');
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const stateToSave = {
      displayedContent,
      currentIndex,
      isTypingComplete,
      commandHistory,
      currentTheme
    };
    localStorage.setItem('terminalState', JSON.stringify(stateToSave));
  }, [displayedContent, currentIndex, isTypingComplete, commandHistory, currentTheme]);

  const themes = {
    cyberpunk: {
      primary: 'text-cyan-300',
      secondary: 'text-teal-300',
      accent: 'text-blue-300',
      command: 'text-cyan-200',
      response: 'text-teal-200/80',
      info: 'text-cyan-100/90',
      link: 'text-blue-300 hover:text-cyan-200',
      border: 'border-cyan-500/20',
      headerBorder: 'border-cyan-500/30',
      codeBg: 'bg-blue-900/20',
      codeBorder: 'border-cyan-900/40',
      codeText: 'text-cyan-200/90',
      glow: 'shadow-[0_0_30px_rgba(45,212,191,0.15)]',
      bg: 'bg-gray-900/30',
      headerBg: 'bg-gray-800/40',
      scanline: 'bg-cyan-400/20',
      dots: [
        'bg-teal-500',
        'bg-cyan-500',
        'bg-blue-500'
      ]
    },
    matrix: {
      primary: 'text-green-400',
      secondary: 'text-emerald-300',
      accent: 'text-lime-300',
      command: 'text-green-300',
      response: 'text-emerald-200/80',
      info: 'text-green-100/90',
      link: 'text-lime-300 hover:text-emerald-200',
      border: 'border-green-500/20',
      headerBorder: 'border-green-500/30',
      codeBg: 'bg-green-900/20',
      codeBorder: 'border-emerald-900/40',
      codeText: 'text-green-200/90',
      glow: 'shadow-[0_0_30px_rgba(74,222,128,0.15)]',
      bg: 'bg-black/70',
      headerBg: 'bg-black/50',
      scanline: 'bg-green-400/20',
      dots: [
        'bg-emerald-500',
        'bg-green-500',
        'bg-lime-500'
      ]
    },
    dracula: {
      primary: 'text-purple-300',
      secondary: 'text-pink-300',
      accent: 'text-violet-300',
      command: 'text-purple-200',
      response: 'text-pink-200/80',
      info: 'text-purple-100/90',
      link: 'text-violet-300 hover:text-pink-200',
      border: 'border-purple-500/20',
      headerBorder: 'border-purple-500/30',
      codeBg: 'bg-purple-900/20',
      codeBorder: 'border-pink-900/40',
      codeText: 'text-purple-200/90',
      glow: 'shadow-[0_0_30px_rgba(192,132,252,0.15)]',
      bg: 'bg-gray-900/50',
      headerBg: 'bg-gray-800/50',
      scanline: 'bg-purple-400/20',
      dots: [
        'bg-pink-500',
        'bg-purple-500',
        'bg-violet-500'
      ]
    },
    monokai: {
      primary: 'text-yellow-300',
      secondary: 'text-orange-300',
      accent: 'text-red-300',
      command: 'text-yellow-200',
      response: 'text-orange-200/80',
      info: 'text-yellow-100/90',
      link: 'text-red-300 hover:text-orange-200',
      border: 'border-yellow-500/20',
      headerBorder: 'border-yellow-500/30',
      codeBg: 'bg-amber-900/20',
      codeBorder: 'border-orange-900/40',
      codeText: 'text-yellow-200/90',
      glow: 'shadow-[0_0_30px_rgba(234,179,8,0.15)]',
      bg: 'bg-gray-800/50',
      headerBg: 'bg-gray-700/50',
      scanline: 'bg-yellow-400/20',
      dots: [
        'bg-orange-500',
        'bg-yellow-500',
        'bg-red-500'
      ]
    }
  };

  const initialContent = [
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
    { 
      type: 'link',
      text: 'Email: ali.alyasseen@ucalgary.ca',
      url: 'mailto:ali.alyasseen@ucalgary.ca'
    },
    { 
      type: 'link',
      text: 'GitHub: github.com/alia720',
      url: 'https://github.com/alia720'
    },
    { 
      type: 'link',
      text: 'LinkedIn: linkedin.com/in/ali-al-yasseen-b76a15250',
      url: 'https://linkedin.com/in/ali-al-yasseen-b76a15250'
    },
    { 
      type: 'link',
      text: 'Phone: (587) 500-4117',
      url: 'tel:+15875004117'
    },
    { type: 'command', text: 'download resume.pdf' },
    { type: 'response', text: 'Initiating secure download via SFTP...' },
    { 
      type: 'link',
      text: '📄 Download Full Resume (PDF)',
      url: '/ali-alyasseen-resume.pdf'
    },
    { type: 'command', text: 'exit' },
    { type: 'response', text: 'Session maintained - For a list of available commands, type `help`.' },
  ];

  const commands = {
    'help': () => [
      { type: 'response', text: 'Available commands:' },
      { type: 'info', text: 'profile       - Show academic profile' },
      { type: 'info', text: 'skills        - Display technical skills' },
      { type: 'info', text: 'experience    - View professional experience' },
      { type: 'info', text: 'contact       - Get contact information' },
      { type: 'info', text: 'resume        - Download resume' },
      { type: 'info', text: 'clear         - Clear terminal history' },
      { type: 'info', text: 'pwd           - Print current directory' },
      { type: 'info', text: 'theme <name>  - Change terminal theme' },
      { type: 'info', text: 'themes        - Show available themes' },
      { type: 'info', text: 'whoami        - Display current user' },
      { type: 'info', text: 'echo <text>   - Repeat input text' },
      { type: 'info', text: 'exit          - End session' },
    ],
    'profile': () => [
      { type: 'header', text: 'ACADEMIC PROFILE' },
      { type: 'info', text: 'Name: Ali Al Yasseen' },
      { type: 'info', text: 'Institution: University of Calgary' },
      { type: 'info', text: 'Program: B.Sc Computer Science (Exp. 2026)' },
      { type: 'info', text: 'Status: Available for internships' },
    ],
    'skills': () => [
      { type: 'code', text: `{
  "languages": ["C", "Assembly", "Python", "TypeScript", "Java", "JavaScript"],
  "frameworks": ["React", "Node.js", "Svelte", "PyQt6", "Tailwind CSS"],
  "systems": ["Linux", "Docker", "TCP Socket Programming", "Real-Time Systems"],
  "databases": ["PostgreSQL", "SQL", "FastDB"],
  "tools": ["Git/GitHub", "Make", "REST API Development", "Web Scraping"]
}` }
    ],
    'experience': () => [
      { type: 'paragraph', text: 'Schulich Ignite (Google IgniteCS) | Feb 2025 - May 2025' },
      { type: 'paragraph', text: '• Taught Python fundamentals to 6+ students using Processing.py' },
      { type: 'paragraph', text: '• Developed interactive coding exercises and grading rubrics' },
      { type: 'paragraph', text: '• Collaborated on curriculum development and lesson planning' },
    ],
    'contact': () => [
      { 
        type: 'link',
        text: 'Email: ali.alyasseen@ucalgary.ca',
        url: 'mailto:ali.alyasseen@ucalgary.ca'
      },
      { 
        type: 'link',
        text: 'GitHub: github.com/alia720',
        url: 'https://github.com/alia720'
      },
      { 
        type: 'link',
        text: 'LinkedIn: linkedin.com/in/ali-al-yasseen-b76a15250',
        url: 'https://linkedin.com/in/ali-al-yasseen-b76a15250'
      },
      { 
        type: 'link',
        text: 'Phone: (587) 500-4117',
        url: 'tel:+15875004117'
      },
    ],
    'resume': () => [
      { type: 'response', text: 'Initiating secure download via SFTP...' },
      { 
        type: 'link',
        text: '📄 Download Full Resume (PDF)',
        url: '/ali-alyasseen-resume.pdf'
      }
    ],
    'clear': () => {
      setDisplayedContent([]);
      setIsTypingComplete(true);
      return [];
    },
    'pwd': () => [
      { type: 'response', text: '/home/user/portfolio' }
    ],
    'theme': (args) => {
      if (args.length === 0) {
        return [
          { type: 'response', text: 'Usage: theme <name>' },
          { type: 'response', text: 'Available themes: cyberpunk, matrix, dracula, monokai' }
        ];
      }
      const theme = args[0].toLowerCase();
      if (themes[theme]) {
        setCurrentTheme(theme);
        return [
          { type: 'response', text: `Theme changed to ${theme}` }
        ];
      }
      return [
        { type: 'response', text: `Invalid theme: ${theme}` },
        { type: 'response', text: 'Available themes: cyberpunk, matrix, dracula, monokai' }
      ];
    },
    'themes': () => [
      { type: 'response', text: 'Available themes:' },
      { type: 'info', text: `cyberpunk ${currentTheme === 'cyberpunk' ? '(active)' : ''}` },
      { type: 'info', text: `matrix ${currentTheme === 'matrix' ? '(active)' : ''}` },
      { type: 'info', text: `dracula ${currentTheme === 'dracula' ? '(active)' : ''}` },
      { type: 'info', text: `monokai ${currentTheme === 'monokai' ? '(active)' : ''}` },
      { type: 'response', text: 'Use "theme <name>" to change theme' }
    ],
    'whoami': () => [
      { type: 'response', text: 'Current user:' },
      { type: 'info', text: 'username: ali' },
      { type: 'info', text: 'name: Ali Al Yasseen' },
      { type: 'info', text: 'role: Computer Scientist' },
      { 
        type: 'info', 
        text: "I am Ali Al Yasseen, a Computer Scientist in training at the University of Calgary (B.Sc. in Computer Science, expected 2026). Passionate about software development, I excel in languages like C, Python, and JavaScript, and have hands-on experience with frameworks and tools such as React, Node.js, and Docker. I've led projects ranging from Discord bots to Chrome extensions, and even taught Python to young learners. Constantly innovating, I thrive on creating impactful solutions and pushing technological boundaries." 
      }
    ],

    'echo': (args) => [
      { type: 'response', text: args.join(' ') }
    ],
    'exit': () => [
      { type: 'response', text: 'Session maintained - For a list of available commands, type `help`.' }
    ],
  };

  useEffect(() => {
    if (currentIndex < initialContent.length && !isTypingComplete) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => [...prev, initialContent[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
        terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
      }, initialContent[currentIndex].type === 'command' ? 1500 : 1000);
      
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, isTypingComplete]);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [displayedContent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newContent = [...displayedContent, { type: 'command', text: inputValue }];
    setDisplayedContent(newContent);
    setCommandHistory(prev => [...prev, inputValue]);
    setInputValue('');
    setHistoryIndex(-1);

    setTimeout(() => {
      const output = processCommand(inputValue);
      if (output.length) setDisplayedContent(prev => [...prev, ...output]);
    }, 500);
  };

  const processCommand = (cmd) => {
    const [command, ...args] = cmd.toLowerCase().trim().split(' ');
    return commands[command]?.(args) || [
      { type: 'response', text: `Command not found: ${cmd}` },
      { type: 'response', text: 'Type "help" for available commands' }
    ];
  };

  const handleKeyDown = (e) => {
    if (!isTypingComplete) return;
    
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const index = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(index);
      setInputValue(commandHistory[commandHistory.length - 1 - index] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const index = Math.max(historyIndex - 1, -1);
      setHistoryIndex(index);
      setInputValue(commandHistory[commandHistory.length - 1 - index] || '');
    }
  };

  const renderContent = (item, index) => {
    const theme = themes[currentTheme];
    const glitchClass = "hover:animate-pulse transition-all duration-300 text-left";
    
    switch (item.type) {
      case 'command':
        return (
          <div className={`mt-2 ${glitchClass}`} key={index}>
            <span className={theme.secondary}>user@hologram</span>
            <span className={theme.primary}>:</span>
            <span className={theme.accent}>~</span>
            <span className={theme.primary}>$</span>
            <span className={`ml-2 ${theme.command}`}>
              {item.text}
            </span>
          </div>
        );
      case 'response':
        return <div className={`${theme.response} ${glitchClass}`} key={index}>{item.text}</div>;
      case 'header':
        return (
          <div className="mt-4 mb-2 text-left" key={index}>
            <div className={`${theme.primary} border-b ${theme.headerBorder} pb-1 ${glitchClass}`}>
              === {item.text} ===
            </div>
          </div>
        );
      case 'info':
        return <div className={`${theme.info} ml-4 ${glitchClass}`} key={index}>{item.text}</div>;
      case 'code':
        return (
          <pre className={`${theme.codeBg} p-3 rounded border ${theme.codeBorder} ${theme.codeText} text-sm my-2 overflow-x-auto ${glitchClass}`} key={index}>
            {item.text}
          </pre>
        );
      case 'paragraph':
        return <p className={`${theme.response} my-1 ${glitchClass}`} key={index}>{item.text}</p>;
      case 'link':
        return (
          <a href={item.url} className={`ml-4 ${theme.link} underline ${glitchClass}`}
             target="_blank" rel="noopener noreferrer" key={index}>
            {item.text}
          </a>
        );
      default:
        return <div key={index}>{item.text}</div>;
    }
  };

  return (
    <section className="py-16 px-6 relative z-10 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
      
      <div className="h-[2px] w-full max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-400/0 via-teal-300/60 to-blue-400/0 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
          <div className={`absolute h-[2px] w-full ${themes[currentTheme].scanline} animate-scanline`}></div>
        </div>
        
        <div className={`${themes[currentTheme].bg} backdrop-blur-xl rounded-lg overflow-hidden border ${themes[currentTheme].border} ${themes[currentTheme].glow} animate-pulse`}>
          <div className={`flex items-center ${themes[currentTheme].headerBg} backdrop-blur-xl px-4 py-2 border-b ${themes[currentTheme].headerBorder}`}>
            <div className="flex space-x-2">
              {themes[currentTheme].dots.map((dotColor, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${dotColor} animate-pulse`} style={{ animationDelay: `${i * 0.5}s` }}></div>
              ))}
            </div>
            <div className={`mx-auto text-xs ${themes[currentTheme].primary}/90 font-mono tracking-widest`}>
              HOLOGRAPHIC-TERMINAL::v3.25
            </div>
          </div>
          
          <div ref={terminalRef} className="p-4 font-mono text-sm h-96 overflow-y-auto text-left relative"
               style={{ backgroundColor: 'rgba(10, 25, 50, 0.4)' }}>
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 pointer-events-none">
              {Array.from({ length: 12 }, (_, i) => <div key={`h-${i}`} className="h-px w-full bg-cyan-500/5"></div>)}
              {Array.from({ length: 12 }, (_, i) => <div key={`v-${i}`} className="w-px h-full bg-cyan-500/5"></div>)}
            </div>
            
            {displayedContent.map((item, index) => renderContent(item, index))}
            
            {isTypingComplete && (
              <form onSubmit={handleSubmit} className="flex items-center mt-2">
                <span className={themes[currentTheme].secondary}>user@hologram</span>
                <span className={themes[currentTheme].primary}>:</span>
                <span className={themes[currentTheme].accent}>~</span>
                <span className={themes[currentTheme].primary}>$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`ml-2 bg-transparent ${themes[currentTheme].command} outline-none flex-1`}
                  autoFocus
                  spellCheck="false"
                />
              </form>
            )}
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