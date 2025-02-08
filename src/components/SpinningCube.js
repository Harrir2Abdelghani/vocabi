import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const RotatingCube = () => {
  // Create a reference to the cube mesh
  const cubeRef = useRef();

  // Automatically rotate the cube on every frame
  useFrame(() => {
    cubeRef.current.rotation.x += 0.01;
    cubeRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={cubeRef}>
      {/* Box geometry with larger size */}
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const SpinningCube = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 0, 5]} />
      <OrbitControls />
      
      {/* Render the RotatingCube inside the Canvas */}
      <RotatingCube />
    </Canvas>
  );
};

export default SpinningCube;
