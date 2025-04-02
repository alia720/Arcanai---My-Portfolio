import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LockScreen = ({ onUnlock }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [path, setPath] = useState([]);
  const [particles, setParticles] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const navigate = useNavigate();

  const setupNodes = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const size = Math.min(container.offsetWidth, container.offsetHeight) * 0.6;
    const nodePositions = Array.from({ length: 9 }, (_, i) => ({
      x: ((i % 3) * size/2) + (container.offsetWidth - size)/2,
      y: (Math.floor(i/3) * size/2) + (container.offsetHeight - size)/2,
      id: i
    }));
    
    setNodes(nodePositions);
  }, []);

  useEffect(() => {
    setupNodes();
    window.addEventListener('resize', setupNodes);
    return () => window.removeEventListener('resize', setupNodes);
  }, [setupNodes]);

  useEffect(() => {
    let animationFrame;
    const animateParticles = () => {
      setParticles(prev => prev
        .map(p => ({
          ...p,
          x: p.x + (Math.random() - 0.5) * 4,
          y: p.y + (Math.random() - 0.5) * 4,
          life: p.life - 0.03
        }))
        .filter(p => p.life > 0)
      );
      animationFrame = requestAnimationFrame(animateParticles);
    };
    
    if (isDrawing) animateParticles();
    return () => cancelAnimationFrame(animationFrame);
  }, [isDrawing]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !nodes.length) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connection line
    if (path.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = '#ff00ff';
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      
      path.forEach((nodeId, i) => {
        const node = nodes[nodeId];
        i === 0 ? ctx.moveTo(node.x, node.y) : ctx.lineTo(node.x, node.y);
      });
      
      ctx.stroke();
    }

    // Draw particles
    particles.forEach(p => {
      const radius = Math.max(0, 2 * p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, ${255 * (1 - p.life)}, 255, ${p.life})`;
      ctx.fill();
    });
  }, [nodes, path, particles]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Input handlers
  const handleInputStart = (pos) => {
    const startNode = nodes.find(node => 
      Math.abs(pos.x - node.x) < 20 && 
      Math.abs(pos.y - node.y) < 20
    );
    
    if (startNode) {
      setIsDrawing(true);
      setPath([startNode.id]);
    }
  };

  const handleInputMove = (pos) => {
    if (!isDrawing || path.length === 0) return;
    
    const lastNodeId = path[path.length - 1];
    const newNode = nodes.find(node => 
      !path.includes(node.id) &&
      Math.abs(pos.x - node.x) < 20 &&
      Math.abs(pos.y - node.y) < 20 &&
      Math.abs(node.id - lastNodeId) <= 3
    );

    if (newNode) {
      setPath(prev => [...prev, newNode.id]);
      setParticles(prev => [...prev.slice(-20), {
        x: newNode.x,
        y: newNode.y,
        life: 1.0
      }]);
    }
  };

  const handleInputEnd = () => {
    if (path.length > 4) {
      onUnlock();
      navigate('/dashboard');
    } else if (path.length > 0) {
      setPath([]);
    }
    setIsDrawing(false);
  };

  const getCanvasPos = useCallback(({ clientX, clientY }) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  return (
    <div ref={containerRef} className="cyber-container">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={e => handleInputStart(getCanvasPos(e))}
        onMouseMove={e => handleInputMove(getCanvasPos(e))}
        onMouseUp={handleInputEnd}
        onTouchStart={e => handleInputStart(getCanvasPos(e.touches[0]))}
        onTouchMove={e => handleInputMove(getCanvasPos(e.touches[0]))}
        onTouchEnd={handleInputEnd}
      />

      {nodes.map((node) => (
        <div
          key={node.id}
          className="cyber-node"
          style={{
            left: node.x - 15,
            top: node.y - 15,
            background: path.includes(node.id) 
              ? 'radial-gradient(circle, #ff00ff 0%, #00ffff 100%)'
              : 'rgba(255,255,255,0.1)',
            borderColor: path.includes(node.id) ? '#00ffff' : '#ff00ff',
            boxShadow: `0 0 ${path.includes(node.id) ? 15 : 5}px ${
              path.includes(node.id) 
                ? 'rgba(0,255,255,0.5)'
                : 'rgba(255,0,255,0.3)'
            }`,
            transform: `scale(${path.includes(node.id) ? 1.2 : 1})`
          }}
        />
      ))}

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '20px',
        transform: 'translateY(-50%) rotate(-5deg)',
        pointerEvents: 'none',
        zIndex: 1000
      }}>
        <div style={{
          fontSize: '2vw',
          fontFamily: 'monospace',
          background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 15px rgba(255,0,255,0.5)',
          position: 'relative',
          padding: '10px 20px',
          border: '2px solid #00ffff',
          boxShadow: '0 0 20px rgba(0,255,255,0.3)'
        }}>
          WELCOME TO MY PORTFOLIO
          <div style={{
            fontSize: '1.2vw',
            marginTop: '10px',
            textShadow: '0 0 10px rgba(0,255,255,0.5)'
          }}>
            LOG IN TO LEARN MORE ABOUT ME
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '6%',
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none'
      }}>
        <div style={{
          fontSize: '1.2rem',
          position: 'relative',
          display: 'inline-block',
          padding: '0 10px',
          overflow: 'hidden',
          background: 'linear-gradient(45deg, #ff00ff, #00ffff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: '0 0 10px rgba(255,0,255,0.3)'
        }}>
          Draw a pattern connecting at least 5 nodes
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.1) 50%, transparent 52%)',
            animation: 'glare 4s linear infinite',
            pointerEvents: 'none'
          }}></div>
        </div>
        {path.length > 0 && (
          <div style={{
            fontSize: '0.9rem',
            marginTop: '10px',
            color: '#00ffff',
            textShadow: '0 0 5px rgba(0,255,255,0.3)'
          }}>
            Nodes selected: {path.length}
          </div>
        )}
      </div>

      <style>{`
        @keyframes glare {
          0% { transform: translate(100%, 100%) rotate(45deg); }
          100% { transform: translate(-100%, -100%) rotate(45deg); }
        }
      `}</style>
    </div>
  );
};

export default LockScreen;