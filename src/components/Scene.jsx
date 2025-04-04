"use client";

import { Canvas } from "@react-three/fiber";
import React from "react";
import Model from "./Model";
import { Environment } from "@react-three/drei";

const Scene = () => {
  return (
    <Canvas
      gl={{ alpha: true }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "transparent",
      }}
    >
      {/* <directionalLight position={[0, 3, 2]} intensity={1} /> */}
      <directionalLight
        position={[5, 10, 7]}
        intensity={9}
        color="#f6f6f6"
        castShadow
      />

      {/* Use your custom image as environment map */}
      <Environment
        background={false}
        // files="selva.jpg" path="/images/"
        preset="forest"
      />

      <Model />
    </Canvas>
  );
};

export default Scene;
