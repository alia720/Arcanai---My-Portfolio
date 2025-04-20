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
      title: "Recipe Rater",
      description: "Full‑stack web app for browsing, creating, rating, commenting on, and categorizing recipes with secure Admin & Customer roles, image uploads, and content moderation.",
      techStack: ["React", "Node.js", "Express", "MySQL", "TailwindCSS", "React Router", "Multer", "Express‑Session", "bcrypt"],
      image: "/Images/RecipeRater.gif",
      demoLink: "https://frontend-production-1d79.up.railway.app/",
      githubLink: "https://github.com/alia720/Recipe-Rater"
    },
    {
      id: 2,
      title: "EggLoL",
      description: "A Discord bot that delivers comprehensive League of Legends champion information and manages user profiles.",
      techStack: ["Python", "PostgreSQL", "BeautifulSoup4", "discord.py", "CRUD"],
      image: "/Images/Egglol.png",
      demoLink: null,
      githubLink: "https://github.com/ALiA720/EGGLOL"
    },
    {
      id: 3,
      title: "RMP-Extension",
      description: "A Chrome extension that seamlessly integrates professor data from the University of Calgary website with ratings from RateMyProfessors.",
      techStack: ["Node.js", "Chrome API", "Puppeteer", "HTML/CSS/JS"],
      image: "/Images/ProfRating.png",
      demoLink: null,
      githubLink: "https://github.com/ALiA720/RMP-EXTENSION"
    },
    {
      id: 4,
      title: "Spout",
      description: "An integrated ecosystem for remote sprinkler management that optimizes water usage by enabling remote activation, detailed water tracking, and weather-based watering tips.",
      techStack: ["Python", "Svelte", "PyQt6", "TCP Sockets"],
      image: "/Images/Spout.gif",
      isGif: true,
      demoLink: null,
      githubLink: "https://github.com/MAiTRA10/SPOUT"
    },
    {
      id: 5,
      title: "Self-Checkout Station Control Software",
      description: "A comprehensive GUI-based self-checkout system developed in Java as part of a 20-member team.",
      techStack: ["Java", "GUI Development", "Team Collaboration", "Case testing"],
      image: "/Images/SENG300.gif",
      isGif: true,
      demoLink: null,
      githubLink: "https://github.com/JackGraver/SENG300-Project-Iteration3"
    },
    {
      id: 6,
      title: "SNESS: A Bare-Metal Snake Game",
      description: "A custom Snake Game implementation at the system level for the Raspberry Pi 4 which uses a custom built SNES driver by interfacing with GPIO pins.",
      techStack: ["C", "Assembly", "Raspberry Pi", "Bare-Metal Programming"],
      image: "/Images/SNES.png",
      demoLink: null,
      githubLink: "https://github.com/alia720/Rpi4-Game"
    },
    {
      id: 7,
      title: "Cat Chat: Feline-Themed Chat Application",
      description: "A playful chat application featuring a multi-threaded server that handles multiple client connections and a Tkinter GUI client with cat-themed elements, emojis, and special commands.",
      techStack: ["Python", "Tkinter", "Socket Programming", "Multi-threading", "GUI Development"],
      image: "/Images/CatChat.gif",
      isGif: true,
      demoLink: null,
      githubLink: "https://github.com/alia720/CatChat"
    },
    {
      id: 8,
      title: "CustomerReach (WIP)",
      description: "An innovative web application that streamlines the discovery of potential customers through business description analysis and targeted criteria matching.",
      techStack: ["FastDB", "React + Vite", "RabbitMQ", "NLPs", "TailwindCSS", "TypeScript"],
      image: null,
      demoLink: null,
      githubLink: "https://github.com/AbdiRazak140/CustomerReach"
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