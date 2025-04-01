import React, { useState } from 'react';

const ProjectCard = ({ 
  title, 
  description, 
  techStack = [], 
  image, 
  isGif = false,
  demoLink, 
  githubLink,
  projectId
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative backdrop-blur-lg bg-blue-900/20 rounded-lg overflow-hidden border border-cyan-900/30 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,_transparent_0px,_transparent_10px,_rgba(34,211,238,0.03)_10px,_rgba(34,211,238,0.03)_11px)] opacity-20" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,_transparent_0px,_transparent_10px,_rgba(34,211,238,0.03)_10px,_rgba(34,211,238,0.03)_11px)] opacity-20" />
      
      <div className="absolute top-3 left-3 bg-blue-900/70 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-900/50 z-10">
        PROJECT#{projectId.toString().padStart(3, '0')}
      </div>
      
      {isGif && (
        <div className="absolute top-3 right-3 bg-purple-900/70 backdrop-blur-md px-2 py-1 rounded text-xs font-mono text-purple-300 border border-purple-900/50 z-10 flex items-center">
          <span className="h-2 w-2 bg-purple-400 rounded-full mr-1 animate-pulse"></span>
          GIF
        </div>
      )}
      
      <div className="h-48 relative overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={title} 
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : ''}`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-800/30 to-purple-900/30 flex items-center justify-center">
            <span className="text-cyan-400/50 text-lg">No Preview Available</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-80" />
        
        <div 
          className="absolute inset-x-0 h-[2px] bg-cyan-400/70 z-10 pointer-events-none"
          style={{ 
            top: isHovered ? `${Math.sin(Date.now() / 1000) * 20 + 50}%` : '100%',
            transition: 'top 0.2s ease-out',
            boxShadow: '0 0 8px rgba(34, 211, 238, 0.8)'
          }}
        />
      </div>
      
      <div className="p-5 relative">
        <h3 className="text-xl font-light mb-2 tracking-wider bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          {title}
        </h3>
        
        <p className="text-gray-300/80 text-sm mb-4 font-light">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-5">
          {techStack.map((tech, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 rounded-sm bg-cyan-900/30 border border-cyan-800/30 text-cyan-300/90"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-4">
          {demoLink && (
            <a 
              href={demoLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="py-2 px-4 rounded text-sm backdrop-blur-md bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors border border-cyan-500/30 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
              Live Demo
            </a>
          )}
          
          {githubLink && (
            <a 
              href={githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="py-2 px-4 rounded text-sm backdrop-blur-md bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors border border-purple-500/30 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              View Code
            </a>
          )}
        </div>
        
        <div className="absolute top-0 right-0 w-10 h-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[2px] h-5 bg-cyan-500/50"></div>
          <div className="absolute top-0 right-0 h-[2px] w-5 bg-cyan-500/50"></div>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Manjots Neural Interface",
      description: "A responsive web application for seamless interaction with Manjots networks.",
      techStack: ["React", "TailwindCSS", "WebGL"],
      image: "/api/placeholder/400/320",
      isGif: true,
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 2,
      title: "Quantum Visualization",
      description: "Interactive visualization platform for #1 quantum computing simulations.",
      techStack: ["Three.js", "Node.js", "Test.js"],
      image: "/api/placeholder/400/320",
      isGif: true,
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 3,
      title: "EggLoL",
      description: "League of Legos discord bot shenanigans",
      techStack: ["discord.py", "Python", "Docker"],
      image: "/api/placeholder/400/320",
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 4,
      title: "Nexus Portal",
      description: "A gateway connecting disparate digital environments through a unified protocol.",
      techStack: ["Go", "gRPC", "PostgreSQL"],
      image: "/api/placeholder/400/320",
      isGif: true,
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 5,
      title: "Synaptic Relay",
      description: "Real-time data processing pipeline for neural network training and deployment.",
      techStack: ["Python", "TensorFlow", "Kafka"],
      image: "/api/placeholder/400/320",
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 6,
      title: "Phantom Cyberdeck",
      description: "Virtual reality interface for immersive coding and data visualization.",
      techStack: ["Unity", "C#", "WebXR"],
      image: "/api/placeholder/400/320",
      isGif: true,
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 7,
      title: "Cascade Protocol",
      description: "Distributed consensus algorithm for secure multi-party computation.",
      techStack: ["Rust", "WebAssembly", "Solidity"],
      image: "/api/placeholder/400/320",
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    },
    {
      id: 8,
      title: "Echo Chamber",
      description: "Audio processing framework for spatial sound design and synthesis.",
      techStack: ["C++", "JUCE", "WebAudio"],
      image: "/api/placeholder/400/320",
      isGif: true,
      demoLink: "https://example.com",
      githubLink: "https://github.com/example"
    }
  ];

  React.useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        html, body {
          overflow-y: auto !important;
          height: auto !important;
        }
      `}</style>
      
      <div className="relative min-h-screen">
        <section className="px-6 relative z-10">
          <div className="h-[2px] w-full max-w-md mx-auto mb-6 bg-gradient-to-r from-blue-400/0 via-cyan-300/80 to-blue-400/0 animate-pulse" />
          
          <h1 className="text-3xl font-light mb-2 tracking-wider text-center bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            PROJECT DATABANK
          </h1>
          
          <p className="text-center text-gray-400 font-light tracking-wide mb-8">
            The Archived network solutions and virtual constructs
          </p>
          
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-16">
            {projects.map(project => (
              <ProjectCard 
                key={project.id}
                title={project.title}
                description={project.description}
                techStack={project.techStack}
                image={project.image}
                isGif={project.isGif}
                demoLink={project.demoLink}
                githubLink={project.githubLink}
                projectId={project.id}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;