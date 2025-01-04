import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
varying float wave;
uniform float time;
uniform vec2 clickPoints[10];
uniform float clickTimes[10];
uniform int numClicks;

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
    
    pos += normal * wave * 0.4;
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
    vec3 deepColor = vec3(0.05, 0.0, 0.1);      // Dark purple base
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

const WaterRipple = () => {
    const containerRef = useRef(null);
    const time = useRef(0);
    const sphereRadius = 5;
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const clickPoints = useRef([]);
    const clickTimes = useRef([]);

    useEffect(() => {
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

        const geometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                clickPoints: { value: Array(10).fill().map(() => new THREE.Vector2(0, 0)) }, // Fixed initialization
                clickTimes: { value: Array(10).fill(0) },
                numClicks: { value: 0 }
            },
            vertexShader,
            fragmentShader
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Create cube
        const cubeGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const cubeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff9900,
            specular: 0x111111,
            shininess: 30
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, sphereRadius + 0.3);
        scene.add(cube);

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const onClick = (event) => {
            mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
            raycaster.current.setFromCamera(mouse.current, camera);
            const intersects = raycaster.current.intersectObject(sphere);
        
            if (intersects.length > 0) {
                const uv = intersects[0].uv;
                const newClickPoint = new THREE.Vector2(uv.x, uv.y);
                
                // Update arrays while maintaining their size
                const newClickPoints = [...material.uniforms.clickPoints.value];
                const newClickTimes = [...material.uniforms.clickTimes.value];
                
                if (newClickPoints.length >= 10) {
                    newClickPoints.shift();
                    newClickTimes.shift();
                }
                
                newClickPoints.push(newClickPoint);
                newClickTimes.push(time.current);
        
                // Update uniforms properly
                material.uniforms.clickPoints.value = newClickPoints;
                material.uniforms.clickTimes.value = newClickTimes;
                material.uniforms.numClicks.value = newClickPoints.length;
        
                // Debug click points and times
                console.log(`New click: (${newClickPoint.x}, ${newClickPoint.y}), Times: ${newClickTimes}`);
            }
        };
        

        const calculateWaveEffect = (uv, currentTime, clickPoints, clickTimes) => {
            let totalWave = 0;
            let force = new THREE.Vector2(0, 0);
            
            for (let i = 0; i < clickPoints.length; i++) {
                const timeSinceClick = currentTime - clickTimes[i];
                const toClick = new THREE.Vector2(
                    clickPoints[i].x - uv.x,
                    clickPoints[i].y - uv.y
                );
                const dist = toClick.length();
                
                const ripple = (
                    Math.sin(dist * 40.0 - timeSinceClick * 4.0) * 0.5 +
                    Math.sin(dist * 30.0 - timeSinceClick * 3.0) * 0.3 +
                    Math.sin(dist * 20.0 - timeSinceClick * 2.0) * 0.2
                ) * Math.exp(-dist * 2.0) * Math.exp(-timeSinceClick * 0.4);
                
                // Debug the ripple and force calculations
                console.log(`Ripple ${i}: dist=${dist}, ripple=${ripple}, force=${force}`);
        
                if (dist > 0.001) {
                    const waveGradient = Math.cos(dist * 40.0 - timeSinceClick * 4.0) * 
                                         Math.exp(-dist * 2.0) * 
                                         Math.exp(-timeSinceClick * 0.4);
                    toClick.normalize().multiplyScalar(waveGradient * 0.5); // Adjust multiplier
                    force.add(toClick);
                }
                
                totalWave += ripple;
            }
            
            console.log(`Total wave: ${totalWave}, Force: ${force}`);
            return { height: totalWave * 0.4, force: force };
        };
        

        let cubeVelocity = new THREE.Vector2(0, 0);
        const cubeInertia = 0.98; // Drag factor
        const cubeSpeed = 0.05;   // Movement speed multiplier

        const animate = () => {
            requestAnimationFrame(animate);
            time.current += 0.01;
            material.uniforms.time.value = time.current;
        
            // Update cube position based on waves
            if (cube && clickPoints.current.length > 0) {
                const cubeUV = new THREE.Vector2(
                    (cube.position.x / sphereRadius / 2) + 0.5,
                    (cube.position.y / sphereRadius / 2) + 0.5
                );
        
                const waveEffect = calculateWaveEffect(
                    cubeUV, 
                    time.current, 
                    clickPoints.current, 
                    clickTimes.current
                );
        
                // Debug the cube's velocity and wave effect
                console.log(`Cube position: ${cube.position}, Velocity: ${cubeVelocity}, Wave effect: ${waveEffect.height}`);
        
                // Update cube velocity based on wave force
                console.log(`Wave Force: ${waveEffect.force}`);
                cubeVelocity.add(waveEffect.force.multiplyScalar(cubeSpeed));
                cubeVelocity.multiplyScalar(cubeInertia);
        
                // Update cube position on sphere surface
                const currentPos = new THREE.Vector3(
                    cube.position.x,
                    cube.position.y,
                    cube.position.z
                );

                console.log(`Current Position: ${currentPos}`);
        
                // Add velocity to position
                currentPos.x += cubeVelocity.x;
                currentPos.y += cubeVelocity.y;
        
                // Project back onto sphere surface
                const normalizedPos = currentPos.normalize();
                cube.position.copy(normalizedPos.multiplyScalar(sphereRadius + waveEffect.height + 0.3));
        
                // Rotate cube based on movement
                cube.rotation.x += cubeVelocity.y * 2;
                cube.rotation.z -= cubeVelocity.x * 2;

                console.log(`Cube Velocity: ${cubeVelocity}`);
                console.log(`Cube Position: ${cube.position}`);

            }

            renderer.render(scene, camera);
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