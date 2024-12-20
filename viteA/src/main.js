import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('#F0F0F0');  // Light background color

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;  // Camera positioned away from origin

// Create a cube for visual representation
const geometry = new THREE.DodecahedronGeometry();
const material = new THREE.MeshStandardMaterial({ color: '#468585' });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Add lighting
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(1, 1, 2);  // Positioning the light source
scene.add(light);

// Create the WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);  // Append the canvas to the body

// Make the renderer responsive to window resizing
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);  // Recursive call for smooth animation

  // Rotate the cube for a little animation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation loop
animate();
