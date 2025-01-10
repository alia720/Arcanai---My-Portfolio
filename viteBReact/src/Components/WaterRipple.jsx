import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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
    
    const cubeRef = useRef(null);
    const coins = useRef([]);
    const score = useRef(0);

    const driftAngle = useRef(0);
    const driftSpeed = useRef(0.002); // Controls drift speed

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
                numClicks: { value: 0 }
            },
            vertexShader,
            fragmentShader
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const cubeGeometry = new THREE.SphereGeometry(0.3, 8, 8);

        const cubeMaterial = new THREE.MeshPhongMaterial({
            color: 0xff9900,
            specular: 0x111111,
            shininess: 30,
            transparent: true,
            opacity: 0.9
        });
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0, 0, sphereRadius - 0.1);
        scene.add(cube);
        cubeRef.current = cube;
    
        const world = new CANNON.World({
            gravity: new CANNON.Vec3(0, 0, 0)
        });

        world.defaultContactMaterial.friction = 0.1;
        world.defaultContactMaterial.restitution = 0.1;
        
        const sphereBody = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Sphere(sphereRadius),
            position: new CANNON.Vec3(0, 0, 0)
        });
        world.addBody(sphereBody);
        
        const circleBody = new CANNON.Body({
            mass: 0.6,
            shape: new CANNON.Box(new CANNON.Vec3(0.2, 0.2, 0.2)),
            position: new CANNON.Vec3(0, 0, sphereRadius + 0.1),
            linearDamping: 0.5,
            angularDamping: 0.7,
            fixedRotation: false,
            velocity: new CANNON.Vec3(0, 0, 0)
        });

        world.addBody(circleBody);

        const createCoin = () => {
            const coinGeometry = new THREE.SphereGeometry(0.2, 8, 8);
            const coinMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
            const coin = new THREE.Mesh(coinGeometry, coinMaterial);
            
            const phi = Math.random() * Math.PI * 2;
            const theta = Math.random() * Math.PI;
            coin.position.setFromSphericalCoords(sphereRadius + 0.3, theta, phi);
            
            scene.add(coin);
            coins.current.push(coin);
        };

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);
        
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const calculateWaveEffect = (position) => {
            const uv = new THREE.Vector2(
                (position.x / sphereRadius / 2) + 0.5,
                (position.y / sphereRadius / 2) + 0.5
            );

            let totalWave = 0;
            let force = new THREE.Vector3(0, 0, 0);

            material.uniforms.clickPoints.value.forEach((clickPoint, i) => {
                if (i >= material.uniforms.numClicks.value) return;

                const timeSinceClick = time.current - material.uniforms.clickTimes.value[i];
                const dist = new THREE.Vector2(
                    clickPoint.x - uv.x,
                    clickPoint.y - uv.y
                ).length();

                // Calculate wave height
                const wave = (
                    Math.sin(dist * 40.0 - timeSinceClick * 4.0) * 0.5 +
                    Math.sin(dist * 30.0 - timeSinceClick * 3.0) * 0.3 +
                    Math.sin(dist * 20.0 - timeSinceClick * 2.0) * 0.2
                ) * Math.exp(-dist * 2.0) * Math.exp(-timeSinceClick * 0.4);

                // Calculate force direction
                if (dist > 0.001) {
                    const direction = new THREE.Vector3(
                        clickPoint.x - uv.x,
                        clickPoint.y - uv.y,
                        0
                    ).normalize();

                    const waveGradient = Math.cos(dist * 40.0 - timeSinceClick * 4.0) * 
                                       Math.exp(-dist * 2.0) * 
                                       Math.exp(-timeSinceClick * 0.4);
                    
                    force.add(direction.multiplyScalar(waveGradient * 0.1));
                }

                totalWave += wave;
            });

            return { height: totalWave * 0.4, force };
        };

        // Old custom Physics code before using built in CANNON
        // const updateCubePhysics = () => {
        //     const waveEffect = calculateWaveEffect(cube.position);
            
        //     // Add force towards front of sphere (camera-facing side)
        //     const toFront = new THREE.Vector3(0, 0, 1);
        //     const frontForce = toFront.multiplyScalar(0.01);
        //     velocityRef.current.add(frontForce);
            
        //     // Calculate tangential forces
        //     const normal = cube.position.clone().normalize();
        //     const tangentialForce = waveEffect.force.clone().sub(
        //         normal.multiplyScalar(waveEffect.force.dot(normal))
        //     );
        //     velocityRef.current.add(tangentialForce);
            
        //     // Stronger damping
        //     velocityRef.current.multiplyScalar(0.9);
            
        //     // Apply position update
        //     const surfaceHeight = sphereRadius + waveEffect.height + 0.3;
        //     cube.position.add(velocityRef.current);
            
        //     // Keep cube on sphere surface
        //     cube.position.normalize().multiplyScalar(surfaceHeight);
            
        //     // Constrain cube to visible hemisphere (z > -2)
        //     if (cube.position.z < -2) {
        //         cube.position.z = -2;
        //         velocityRef.current.z = Math.abs(velocityRef.current.z) * 0.5;
        //     }
            
        //     // Update rotation based on movement
        //     cube.rotation.x += velocityRef.current.y;
        //     cube.rotation.z -= velocityRef.current.x;
        // };

        const checkCoinCollisions = () => {
            coins.current = coins.current.filter(coin => {
                if (cubeRef.current.position.distanceTo(coin.position) < 0.5) {
                    score.current += 1;
                    scene.remove(coin);
                    return false;
                }
                coin.rotation.y += 0.02;
                return true;
            });
            
            if (coins.current.length < 5) {
                createCoin();
            }
        };

        const animate = () => {
            requestAnimationFrame(animate);
            time.current += 0.01;
            material.uniforms.time.value = time.current;
            driftAngle.current += driftSpeed.current;
        
            const waveEffect = calculateWaveEffect(cube.position);
    
            // Increase force magnitude and ensure all axes are affected
            const force = waveEffect.force.multiplyScalar(30); // Increased from 15
            circleBody.applyForce(
                new CANNON.Vec3(force.x, force.y, force.z * 0.5), // Added z-axis component
                new CANNON.Vec3(
                    circleBody.position.x + 0.1, 
                    circleBody.position.y + 0.1,
                    circleBody.position.z
                )
            );

                // Add gentle circular drift force
            const driftForce = new CANNON.Vec3(
                Math.cos(driftAngle.current) * 0.1,
                Math.sin(driftAngle.current) * 0.1,
                0
            );
            circleBody.applyForce(driftForce, circleBody.position);
        
            // Gentler surface constraint
            const pos = circleBody.position;
            const distanceFromCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
            const toSphere = new CANNON.Vec3(
                pos.x / distanceFromCenter,
                pos.y / distanceFromCenter,
                pos.z / distanceFromCenter
            );
            const surfaceForce = toSphere.scale(3 * (sphereRadius - 0.1 - distanceFromCenter));
            circleBody.applyForce(surfaceForce, circleBody.position);
        
            world.step(1/60);
            cube.position.copy(circleBody.position);
            cube.quaternion.copy(circleBody.quaternion);
            
            checkCoinCollisions();
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
                
                const newClickPoints = [...material.uniforms.clickPoints.value];
                const newClickTimes = [...material.uniforms.clickTimes.value];
                
                if (newClickPoints.length >= 10) {
                    newClickPoints.shift();
                    newClickTimes.shift();
                }
                
                newClickPoints.push(newClickPoint);
                newClickTimes.push(time.current);
        
                material.uniforms.clickPoints.value = newClickPoints;
                material.uniforms.clickTimes.value = newClickTimes;
                material.uniforms.numClicks.value = Math.min(newClickPoints.length, 10);
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