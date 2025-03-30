import React, { useState, useEffect } from 'react';

const DashboardMetric = ({ label, value, icon, maxValue = 100, color = "cyan" }) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="backdrop-blur-lg bg-blue-900/20 rounded-lg p-4 border border-blue-400/20">
      <div className="flex items-center mb-2">
        <div className="mr-2">{icon}</div>
        <h3 className="text-sm font-light tracking-wider bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
          {label}
        </h3>
      </div>
      
      <div className="mb-1 text-2xl font-light bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        {value.toLocaleString()}
        <span className="text-xs ml-1 text-cyan-300/70">/ {maxValue.toLocaleString()}</span>
      </div>
      
      <div className="h-1 w-full bg-gray-800/60 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color === "cyan" ? "bg-gradient-to-r from-cyan-400 to-blue-500" : 
            color === "purple" ? "bg-gradient-to-r from-purple-400 to-pink-500" : 
            "bg-gradient-to-r from-green-400 to-cyan-500"}`}
          style={{ width: `${percentage}%`, transition: 'width 1s ease-in-out' }}
        />
      </div>
    </div>
  );
};

const SystemStatus = ({ status = "online" }) => {
  const statusColors = {
    online: "bg-green-500",
    warning: "bg-yellow-500",
    offline: "bg-red-500",
    standby: "bg-blue-500"
  };
  
  return (
    <div className="flex items-center">
      <div className={`h-2 w-2 rounded-full ${statusColors[status]} mr-2 animate-pulse`}></div>
      <span className="text-xs uppercase tracking-wider text-gray-300">{status}</span>
    </div>
  );
};

// SVG Icons
const CpuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="14" x2="23" y2="14"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="14" x2="4" y2="14"></line>
  </svg>
);

const MemoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
    <line x1="6" y1="6" x2="6" y2="18"></line>
    <line x1="10" y1="6" x2="10" y2="18"></line>
    <line x1="14" y1="6" x2="14" y2="18"></line>
    <line x1="18" y1="6" x2="18" y2="18"></line>
  </svg>
);

const NetworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    network: 0,
    projects: 0,
    skills: 0,
    experience: 0
  });
  
  useEffect(() => {
    // Simulate loading of metrics
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.floor(70 + Math.random() * 20),
        memory: Math.floor(60 + Math.random() * 30),
        network: Math.floor(80 + Math.random() * 15),
        projects: 12,
        skills: 24,
        experience: 5
      });
    }, 3000);
    
    // Initial animation from 0 to values
    const initialTimeout = setTimeout(() => {
      setMetrics({
        cpu: 78,
        memory: 64,
        network: 92,
        projects: 12,
        skills: 24,
        experience: 5
      });
    }, 500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);
  
  return (
    <section className="py-16 px-6 relative z-10">
      <div className="h-[2px] w-full max-w-md mx-auto mb-8 bg-gradient-to-r from-blue-400/0 via-cyan-300/80 to-blue-400/0 animate-pulse" />
      
      <h1 className="text-3xl font-light mb-1 tracking-wider text-center bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
        SYSTEMS OVERVIEW
      </h1>
      
      <p className="text-center text-gray-400 font-light tracking-wide mb-10">
        <SystemStatus status="online" /> // Connection established
      </p>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardMetric 
          label="CPU UTILIZATION" 
          value={metrics.cpu} 
          icon={<CpuIcon />} 
          color="cyan" 
        />
        
        <DashboardMetric 
          label="MEMORY ALLOCATION" 
          value={metrics.memory} 
          icon={<MemoryIcon />} 
          color="purple" 
        />
        
        <DashboardMetric 
          label="NETWORK UPLINK" 
          value={metrics.network} 
          icon={<NetworkIcon />} 
          color="green" 
        />
        
        <DashboardMetric 
          label="PROJECTS DEPLOYED" 
          value={metrics.projects} 
          maxValue={20}
          icon={<CpuIcon />} 
          color="cyan" 
        />
        
        <DashboardMetric 
          label="SKILL MODULES" 
          value={metrics.skills} 
          maxValue={30}
          icon={<MemoryIcon />} 
          color="purple" 
        />
        
        <DashboardMetric 
          label="EXPERIENCE MATRIX" 
          value={metrics.experience} 
          maxValue={10}
          icon={<NetworkIcon />} 
          color="green" 
        />
      </div>
    </section>
  );
};

export default Dashboard;