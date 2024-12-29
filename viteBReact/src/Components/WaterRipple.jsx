import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

// Import shaders
import waterVertexShader from '../shaders/waterVertex.glsl';
import waterFragmentShader from '../shaders/waterFragment.glsl';
import heightmapFragmentShader from '../shaders/heightmapFragment.glsl';
import smoothFragmentShader from '../shaders/smoothFragment.glsl';

const WaterRipple = () => {
  const containerRef = useRef(null);

  // Constants
  const FBO_WIDTH = 512;
  const FBO_HEIGHT = 256;
  const GEOM_WIDTH = window.innerWidth;
  const GEOM_HEIGHT = window.innerWidth / 2;

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    
    // Camera setup
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -1000,
      1000
    );
    camera.position.z = 100;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(300, 400, 175);
    scene.add(directionalLight);

    // Initialize GPU computation
    const gpuCompute = new GPUComputationRenderer(FBO_WIDTH, FBO_HEIGHT, renderer);
    if (!renderer.capabilities.isWebGL2) {
      gpuCompute.setDataType(THREE.HalfFloatType);
    }

    // Create heightmap texture
    const heightmap0 = gpuCompute.createTexture();
    fillTexture(heightmap0);

    // Add heightmap variable
    const heightmapVariable = gpuCompute.addVariable('heightmap', heightmapFragmentShader, heightmap0);
    gpuCompute.setVariableDependencies(heightmapVariable, [heightmapVariable]);

    // Set heightmap uniforms
    heightmapVariable.material.uniforms['mousePos'] = { value: new THREE.Vector2(10000, 10000) };
    heightmapVariable.material.uniforms['mouseSize'] = { value: 20.0 };
    heightmapVariable.material.uniforms['viscosityConstant'] = { value: 0.98 };
    heightmapVariable.material.uniforms['waveheightMultiplier'] = { value: 0.3 };

    // Initialize computation
    const error = gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }

    // Create water material
    const geometry = new THREE.PlaneGeometry(GEOM_WIDTH, GEOM_HEIGHT, FBO_WIDTH - 1, FBO_HEIGHT - 1);
    
    // Create shader material
    const material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.ShaderLib['phong'].uniforms,
        {
          heightmap: { value: null }
        }
      ]),
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      lights: true,
      defines: {
        FBO_WIDTH: FBO_WIDTH.toFixed(1),
        FBO_HEIGHT: FBO_HEIGHT.toFixed(1),
        GEOM_WIDTH: GEOM_WIDTH.toFixed(1),
        GEOM_HEIGHT: GEOM_HEIGHT.toFixed(1)
      }
    });

    // Set material properties
    material.uniforms['diffuse'].value = new THREE.Color(0x156289);
    material.uniforms['specular'].value = new THREE.Color(0x111111);
    material.uniforms['shininess'].value = Math.max(50, 1e-4);

    const waterMesh = new THREE.Mesh(geometry, material);
    scene.add(waterMesh);

    // Animation
    const animate = () => {
      // Update heightmap
      gpuCompute.compute();
      
      // Update water uniforms
      material.uniforms['heightmap'].value = 
        gpuCompute.getCurrentRenderTarget(heightmapVariable).texture;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();

    // Helper functions
    function fillTexture(texture) {
      const simplex = new SimplexNoise();
      const waterMaxHeight = 2;
      const pixels = texture.image.data;

      function noise(x, y) {
        let multR = waterMaxHeight;
        let mult = 0.025;
        let r = 0;
        for (let i = 0; i < 15; i++) {
          r += multR * simplex.noise(x * mult, y * mult);
          multR *= 0.53 + 0.025 * i;
          mult *= 1.25;
        }
        return r;
      }

      let p = 0;
      for (let j = 0; j < FBO_HEIGHT; j++) {
        for (let i = 0; i < FBO_WIDTH; i++) {
          const x = i * 128 / FBO_WIDTH;
          const y = j * 128 / FBO_HEIGHT;
          pixels[p + 0] = noise(x, y);
          pixels[p + 1] = 0;
          pixels[p + 2] = 0;
          pixels[p + 3] = 1;
          p += 4;
        }
      }
    }

    // Cleanup
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }} 
    />
  );
};

export default WaterRipple;