import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import Navbar from "./Components/Navbar";
import './index.css';

const RotatingCube = () => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      //meshRef.current.rotation.y += 0.01;
      //meshRef.current.rotation.x += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[1, 1, 1]} />
      <meshLambertMaterial color="#468585" emissive="#468585" />
    </mesh>
  );
};

const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw", // Ensures the container spans the full viewport width
        margin: 0,
        padding: 0,
        overflow: "hidden", // Prevents any unintended scrolling
      }}
    >
      {/* Navbar */}
      <div
        style={{
          position: "relative",
          zIndex: 1, // Ensures the navbar is above the canvas
        }}
      >
        <Navbar />
      </div>

      {/* 3D Canvas */}
      <div style={{ flex: 1 }}>
        <Canvas
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <OrbitControls enableZoom enablePan enableRotate />
          <directionalLight
            position={[1, 1, 1]}
            intensity={10}
            color="#9CDBA6"
          />
          <color attach={"background"} args={["#F0F0F0"]} />
          <RotatingCube />
        </Canvas>
      </div>
    </div>
  );
};

export default App;
