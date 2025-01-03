import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';


const vertexShader = `
varying vec2 vUv;
varying float wave;
uniform float time;
uniform vec2 mouse;

void main() {
    vUv = uv;
    vec3 pos = position;
    float dist = distance(uv, mouse);
    wave = sin(dist * 50.0 - time * 5.0) * exp(-dist * 3.0);
    pos += normal * wave * 0.2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;


const fragmentShader = `
varying vec2 vUv;
varying float wave;

void main() {
    // Ensure wave value is clamped to prevent black colors
    float clampedWave = clamp(wave, -1.0, 1.0);
    vec3 baseColor = vec3(0.0, 0.4, 0.8);
    vec3 peakColor = vec3(0.0, 0.6, 1.0);
    vec3 color = mix(baseColor, peakColor, clampedWave * 0.5 + 0.5);
    gl_FragColor = vec4(color, 1.0);
}
`;

const WaterRipple = () => {
    const containerRef = useRef(null);
    const mousePos = useRef(new THREE.Vector2(0.5, 0.5));
    const time = useRef(0);

    useEffect(() => {
        // Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(5, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0.5, 0.5) }
            },
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const onMouseMove = (event) => {
            mousePos.current.x = (event.clientX / window.innerWidth) - 0.25;
            mousePos.current.y = 1 - (event.clientY / window.innerHeight);
            
            // Clamp values to ensure they stay within UV bounds (0 to 1)
            mousePos.current.x = Math.min(Math.max(mousePos.current.x, 0), 1);
        };
        window.addEventListener('mousemove', onMouseMove);

        const animate = () => {
            requestAnimationFrame(animate);
            time.current += 0.01;
                        
            material.uniforms.time.value = time.current;
            material.uniforms.mouse.value = mousePos.current;
            
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} style={{ 
            width: '100vw', 
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            background: '#000'
        }} />
    );
};

export default WaterRipple;