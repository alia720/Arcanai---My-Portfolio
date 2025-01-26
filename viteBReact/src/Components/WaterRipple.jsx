import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

const vertexShader = `
varying vec2 vUv;
varying float wave;
uniform float time;
uniform vec2 clickPoints[10];
uniform float clickTimes[10];
uniform int numClicks;
uniform float bassIntensity;

void main() {
    vUv = uv;
    vec3 pos = position;
    wave = 0.0;
    
    for(int i = 0; i < 10; i++) {
        if(i >= numClicks) break;
        float timeSinceClick = time - clickTimes[i];
        float dist = distance(uv, clickPoints[i]);
        float ripple = (
            sin(dist * 40.0 - timeSinceClick * 4.0) * 0.5 +
            sin(dist * 30.0 - timeSinceClick * 3.0) * 0.3 +
            sin(dist * 20.0 - timeSinceClick * 2.0) * 0.2
        ) * exp(-dist * 2.0) * exp(-timeSinceClick * 0.4);
        wave += ripple;
    }
    
    // Modify the wave amplitude based on bass intensity
    pos += normal * wave * (0.4 + bassIntensity * 2.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float wave;
uniform float time;

float hexagon(vec2 p, float radius) {
    vec2 q = abs(p);
    return max(q.x * 0.866025 + q.y * 0.5, q.y) - radius;
}

void main() {
    float clampedWave = clamp(wave, -1.0, 1.0);
    
    // Hextech colors
    vec3 deepColor = vec3(0.05, 0.02, 0.1);      // Dark purple base
    vec3 energyColor = vec3(0.7, 0.2, 0.9);     // Bright hextech purple
    vec3 glowColor = vec3(0.9, 0.4, 1.0);       // Bright magenta glow
    vec3 rippleColor = vec3(1.0, 0.2, 0.5);     // Bright pink for ripples
    
    // Energy pattern
    vec2 center = vUv - 0.5;
    float angle = atan(center.y, center.x);
    float radius = length(center);
    
    // Smooth energy effect
    float energy = sin(angle * 6.0 + time * 2.0) * 0.5 + 0.5;
    energy *= sin(radius * 10.0 - time * 3.0) * 0.5 + 0.5;
    
    // Hexagonal pattern
    vec2 hex = vUv * 8.0;
    float hexPattern = hexagon(fract(hex) - 0.5, 0.3);
    hexPattern *= hexagon(fract(hex * 0.5) - 0.5, 0.3);
    
    // Combine effects with separate ripple color
    vec3 baseEffect = mix(deepColor, energyColor, energy);
    baseEffect = mix(baseEffect, glowColor, hexPattern * energy);
    
    // Add pink ripples
    vec3 color = mix(baseEffect, rippleColor, abs(clampedWave) * 0.6);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

const AudioRippleSphere = () => {
    const containerRef = useRef(null);
    const time = useRef(0);
    const sphereRadius = 5;
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const materialRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    // Persistent ripple state
    const ripplePointsRef = useRef({
        points: [],
        times: []
    });

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 10;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        containerRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                clickPoints: { value: Array(10).fill().map(() => new THREE.Vector2(0, 0)) },
                clickTimes: { value: Array(10).fill(0) },
                numClicks: { value: 0 },
                bassIntensity: { value: 0.0 }
            },
            vertexShader,
            fragmentShader
        });
        materialRef.current = material;

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
    
        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, 0, 0)
        });

        const sphereBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(sphereRadius),
            position: new CANNON.Vec3(0, 0, 0)
        });
        world.addBody(sphereBody);
        
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const animate = () => {
            requestAnimationFrame(animate);
            time.current += 0.01;
            material.uniforms.time.value = time.current;

            // Audio frequency visualization
            if (analyserRef.current) {
                const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(frequencyData);
                
                // Average frequency across bass and mid frequencies
                const bassFrequency = frequencyData.slice(0, 8).reduce((a, b) => a + b, 0) / 8 / 255;

                //material.uniforms.bassIntensity.value = bassFrequency;
    
                // Add ripples when audio is loud enough, with reduced frequency
                if (bassFrequency > 0.5 && Math.random() > 0.7) { // Increased threshold and added randomization
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.4 + 0.3; // Keep ripples more centered
                    const randomX = 0.5 + Math.cos(angle) * radius;
                    const randomY = 0.5 + Math.sin(angle) * radius;
                    const newClickPoint = new THREE.Vector2(randomX, randomY);
                    
                    // Manage ripple points (max 5 instead of 10 for less chaos)
                    if (ripplePointsRef.current.points.length >= 5) {
                        ripplePointsRef.current.points.shift();
                        ripplePointsRef.current.times.shift();
                    }
                    
                    ripplePointsRef.current.points.push(newClickPoint);
                    ripplePointsRef.current.times.push(time.current);
                    
                    // Update shader uniforms
                    material.uniforms.clickPoints.value = ripplePointsRef.current.points;
                    material.uniforms.clickTimes.value = ripplePointsRef.current.times;
                    material.uniforms.numClicks.value = ripplePointsRef.current.points.length;
                }
            }

            renderer.render(scene, camera);
        };
        const onClick = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            raycaster.current.setFromCamera(mouse.current, camera);
            const intersects = raycaster.current.intersectObject(sphere);
        
            if (intersects.length > 0) {
                const uv = intersects[0].uv;
                const newClickPoint = new THREE.Vector2(uv.x, uv.y);
                
                // Manage ripple points (max 10)
                if (ripplePointsRef.current.points.length >= 10) {
                    ripplePointsRef.current.points.shift();
                    ripplePointsRef.current.times.shift();
                }
                
                ripplePointsRef.current.points.push(newClickPoint);
                ripplePointsRef.current.times.push(time.current);
                
                // Update shader uniforms
                material.uniforms.clickPoints.value = ripplePointsRef.current.points;
                material.uniforms.clickTimes.value = ripplePointsRef.current.times;
                material.uniforms.numClicks.value = ripplePointsRef.current.points.length;
            }
        };

        animate();
        window.addEventListener('click', onClick);
        
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('click', onClick);
            window.removeEventListener('resize', handleResize);
            containerRef.current?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    const startAudioVisualization = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;
            
            const analyser = audioContext.createAnalyser();
            analyserRef.current = analyser;
            analyser.fftSize = 128;
            
            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;
            
            source.connect(analyser);
            
            setIsListening(true);
        } catch (err) {
            console.error("Error accessing microphone", err);
        }
    };

    const stopAudioVisualization = () => {
        if (sourceRef.current) {
            sourceRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setIsListening(false);
    };

    return (
        <div>
            <div 
                ref={containerRef} 
                style={{ 
                    width: '100vw', 
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    background: 'transparent'
                }} 
            />
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }}>
                {!isListening ? (
                    <button onClick={startAudioVisualization}>
                        Start Audio Visualization
                    </button>
                ) : (
                    <button onClick={stopAudioVisualization}>
                        Stop Audio Visualization
                    </button>
                )}
            </div>
        </div>
    );
};

export default AudioRippleSphere;