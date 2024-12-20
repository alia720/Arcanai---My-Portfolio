import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#F0F0F0'); // Light background

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create the geometry and material for a dodecahedron
const geometry = new THREE.DodecahedronGeometry();
const material = new THREE.MeshStandardMaterial({
  color: '#468585',
  emissive: '#468585',
  roughness: 0.4,
  metalness: 0.3,
});

// Create the dodecahedron mesh
const dodecahedron = new THREE.Mesh(geometry, material);
scene.add(dodecahedron);

// Add lighting
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(1, 1, 2);
scene.add(light);

// Add ambient light for softer shadows
const ambientLight = new THREE.AmbientLight(0xCCCCCC, 0.5);
scene.add(ambientLight);

// Create the WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Make the renderer responsive to window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  dodecahedron.rotation.x += 0.01; // Rotate on the x-axis
  dodecahedron.rotation.y += 0.01; // Rotate on the y-axis
  renderer.render(scene, camera);
}
animate();
