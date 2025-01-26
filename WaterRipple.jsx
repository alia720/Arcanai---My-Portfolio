import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader } from './shaders/vertexShader';
import { fragmentShader } from './shaders/fragmentShader';

const WaterRipple = () => {
    const containerRef = useRef(null);
    const time = useRef(0);
    const clickPoints = useRef([]);
    const clickTimes = useRef([]);
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const dataArray = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Audio setup
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 256;
        const bufferLength = analyser.current.frequencyBinCount;
        dataArray.current = new Uint8Array(bufferLength);

        // Create sphere
        const geometry = new THREE.SphereGeometry(2, 128, 128);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                clickPoints: { value: Array(10).fill().map(() => new THREE.Vector2(0, 0)) },
                clickTimes: { value: Array(10).fill(0) },
                numClicks: { value: 0 },
                audioData: { value: new Float32Array(128) },
                bassIntensity: { value: 0.0 }
            },
            vertexShader,
            fragmentShader,
            wireframe: false
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        camera.position.z = 5;

        // Handle clicks
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const handleClick = (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(sphere);

            if (intersects.length > 0) {
                const uv = intersects[0].uv;
                clickPoints.current.push(new THREE.Vector2(uv.x, uv.y));
                clickTimes.current.push(time.current);

                if (clickPoints.current.length > 10) {
                    clickPoints.current.shift();
                    clickTimes.current.shift();
                }

                material.uniforms.clickPoints.value = clickPoints.current;
                material.uniforms.clickTimes.value = clickTimes.current;
                material.uniforms.numClicks.value = clickPoints.current.length;
            }
        };

        container.addEventListener('click', handleClick);

        // Audio connection
        const connectAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const source = audioContext.current.createMediaStreamSource(stream);
                source.connect(analyser.current);
            } catch (error) {
                console.error('Error setting up audio:', error);
            }
        };

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            time.current += 0.01;
            material.uniforms.time.value = time.current;

            // Update audio data
            if (analyser.current) {
                analyser.current.getByteFrequencyData(dataArray.current);
                
                const bassFrequencies = dataArray.current.slice(0, 10);
                const bassAverage = bassFrequencies.reduce((a, b) => a + b, 0) / bassFrequencies.length;
                material.uniforms.bassIntensity.value = bassAverage / 255;

                const normalizedData = Array.from(dataArray.current)
                    .map(value => value / 255);
                material.uniforms.audioData.value = new Float32Array(normalizedData);
            }

            sphere.rotation.x += 0.001;
            sphere.rotation.y += 0.001;

            renderer.render(scene, camera);
        };

        // Handle window resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Add start button
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Audio';
        startButton.style.position = 'fixed';
        startButton.style.zIndex = '1000';
        startButton.style.top = '20px';
        startButton.style.left = '20px';
        document.body.appendChild(startButton);

        startButton.addEventListener('click', () => {
            connectAudio();
        });

        animate();

        return () => {
            container.removeEventListener('click', handleClick);
            window.removeEventListener('resize', handleResize);
            document.body.removeChild(startButton);
            if (audioContext.current) {
                audioContext.current.close();
            }
            container.removeChild(renderer.domElement);
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
