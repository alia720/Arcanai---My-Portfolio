import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WaterRippleScreen = ({ theme }) => {
  const containerRef = useRef(null);
  const mousePos = useRef(new THREE.Vector3(-1, -1, 0));
  const [lowPerformance, setLowPerformance] = useState(false);
  const lowPerformanceRef = useRef(lowPerformance);
  const fpsBuffer = useRef([]);
  const fpsBufferSize = 10;
  const rendererRef = useRef(null);

  // Fallback style when performance is low
  const fallbackStyle = {
    background: theme === "orange" 
      ? 'linear-gradient(135deg, rgb(110, 73, 4), rgb(240, 86, 30))'
      : 'linear-gradient(135deg, #1E90FF, #00008B)',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: -1
  };

  // Keep ref in sync with state
  useEffect(() => {
    lowPerformanceRef.current = lowPerformance;
  }, [lowPerformance]);

  useEffect(() => {
    if (lowPerformance) return;

    // Performance benchmark
    const runPerformanceCheck = () => {
      const tempCanvas = document.createElement("canvas");
      const tempGl = tempCanvas.getContext("webgl") || tempCanvas.getContext("experimental-webgl");
      if (!tempGl) {
        setLowPerformance(true);
        return true;
      }

      const iterations = 100;
      const start = performance.now();
      for (let i = 0; i < iterations; i++) {
        tempGl.clear(tempGl.COLOR_BUFFER_BIT);
      }
      const avgTimePerFrame = (performance.now() - start) / iterations;
      tempCanvas.remove();
      
      if (avgTimePerFrame > 1.0) {
        setLowPerformance(true);
        return true;
      }
      return false;
    };

    if (runPerformanceCheck()) return;

    // Three.js setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Simulation setup
    const rtOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    let simRT1 = new THREE.WebGLRenderTarget(width, height, rtOptions);
    let simRT2 = new THREE.WebGLRenderTarget(width, height, rtOptions);
    let currentRT = simRT1;
    let nextRT = simRT2;

    // Simulation scene
    const simScene = new THREE.Scene();
    const simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const simGeo = new THREE.PlaneGeometry(2, 2);

    const simUniforms = {
      u_texture: { value: currentRT.texture },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_aspectRatio: { value: width / height },
      u_mouse: { value: mousePos.current },
      time: { value: 0 },
      ringWidth: { value: 4.0 },
      ringStrength: { value: 0.7 },
    };

    const simMaterial = new THREE.ShaderMaterial({
      uniforms: simUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D u_texture;
        uniform vec2 u_resolution;
        uniform float u_aspectRatio;
        uniform vec3 u_mouse;
        uniform float time;
        uniform float ringWidth;
        uniform float ringStrength;
        varying vec2 vUv;
        
        #define SAMPLE_STEP 5
        
        float delta = 1.21;
        
        void main() {
          vec2 fragCoord = vUv * u_resolution;
          ivec2 uv = ivec2(fragCoord);
          
          vec2 mouse = u_mouse.xy;
          mouse.y = u_resolution.y - mouse.y;
          float dist = distance(fragCoord, mouse);
          
          vec4 data = texelFetch(u_texture, uv, 0);
          float force = data.x;
          float velo = data.y;
          
          float rgt = texelFetch(u_texture, uv + ivec2(SAMPLE_STEP, 0), 0).r;
          float lft = texelFetch(u_texture, uv + ivec2(-SAMPLE_STEP, 0), 0).r;
          float upw = texelFetch(u_texture, uv + ivec2(0, SAMPLE_STEP), 0).r;
          float dwn = texelFetch(u_texture, uv + ivec2(0, -SAMPLE_STEP), 0).r;
          
          if(fragCoord.x <= 0.5) lft = rgt;
          if(fragCoord.x >= u_resolution.x - 0.5) rgt = lft;
          if(fragCoord.y <= 0.5) dwn = upw;
          if(fragCoord.y >= u_resolution.y - 0.5) upw = dwn;
          
          velo += delta * (-2.0 * force + rgt + lft) / 4.0;
          velo += delta * (-2.0 * force + upw + dwn) / 4.0;
          force += delta * velo;
          velo -= 0.004 * delta * force;
          velo *= 1.0 - 0.004 * delta;
          force *= 0.98;
          
          vec4 fragColor = vec4(force, velo, (rgt - lft) / 2.0, (upw - dwn) / 2.0);
          
          float radius = 15.0 * u_mouse.z;
          float innerRadius = radius - ringWidth;
          
          if(u_mouse.z > 0.0) {
            float ring = smoothstep(innerRadius - 1.0, innerRadius, dist) * 
                         smoothstep(radius + 1.0, radius, dist);
            fragColor.x += ring * ringStrength;
          }
          
          gl_FragColor = fragColor;
        }
      `,
    });

    simScene.add(new THREE.Mesh(simGeo, simMaterial));

    // Final render setup
    const finalScene = new THREE.Scene();
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const finalMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_texture: { value: currentRT.texture },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_colorMultiplier: { 
          value: theme === "orange"
            ? new THREE.Vector3(1.0, 0.5, 0.1)
            : new THREE.Vector3(0.2, 0.5, 1.0)
        },
        u_bloomReduction: { value: 0.7 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D u_texture;
        uniform vec2 u_resolution;
        uniform vec3 u_colorMultiplier;
        uniform float u_bloomReduction;
        varying vec2 vUv;
        
        void main() {
          vec4 data = texture2D(u_texture, vUv);
          float intensity = pow(data.r * u_bloomReduction, 0.8);
          vec3 color = u_colorMultiplier * (0.3 + intensity);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    finalScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), finalMaterial));

    // Event handlers
    const onMouseMove = (event) => {
      mousePos.current.set(event.clientX, event.clientY, 1);
    };
    
    const onMouseDown = () => {
      mousePos.current.z = 1;
    };
    
    const onMouseUp = () => {
      mousePos.current.z = 0;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Animation loop
    let lastFrameTime = performance.now();
    let animationFrameId = null;
    let resolutionScale = 1.0;
    
    const animate = () => {
      if (lowPerformanceRef.current) {
        cleanup();
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const deltaTime = now - lastFrameTime;
      lastFrameTime = now;
      const fps = 1000 / deltaTime;

      // Update FPS buffer
      fpsBuffer.current.push(fps);
      if (fpsBuffer.current.length > fpsBufferSize) fpsBuffer.current.shift();
      
      // Check average FPS
      if (fpsBuffer.current.length === fpsBufferSize) {
        const avgFPS = fpsBuffer.current.reduce((a, b) => a + b, 0) / fpsBufferSize;
        if (avgFPS < 30) {
          setLowPerformance(true);
          return;
        }
      }

      // Dynamic resolution scaling
      if (fps < 30 && resolutionScale > 0.5) {
        resolutionScale = Math.max(0.5, resolutionScale - 0.05);
      } else if (fps > 45 && resolutionScale < 1.0) {
        resolutionScale = Math.min(1.0, resolutionScale + 0.05);
      }

      const newWidth = Math.floor(window.innerWidth * resolutionScale);
      const newHeight = Math.floor(window.innerHeight * resolutionScale);
      
      simUniforms.u_resolution.value.set(newWidth, newHeight);
      finalMaterial.uniforms.u_resolution.value.set(newWidth, newHeight);
      renderer.setSize(newWidth, newHeight);
    
      simUniforms.u_texture.value = currentRT.texture;
      simUniforms.time.value = now / 1000;
    
      renderer.setRenderTarget(nextRT);
      renderer.render(simScene, simCamera);
      renderer.setRenderTarget(null);
      [currentRT, nextRT] = [nextRT, currentRT];
    
      finalMaterial.uniforms.u_texture.value = currentRT.texture;
      renderer.render(finalScene, orthoCamera);
    };

    const cleanup = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current && containerRef.current.contains(rendererRef.current.domElement)) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
      }
    };

    animate();

    return cleanup;
  }, [theme, lowPerformance]);

  return (
    <div
      ref={containerRef}
      style={lowPerformance ? fallbackStyle : {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1
      }}
    />
  );
};

export default WaterRippleScreen;