import React, { useRef, useState } from "react";
import {
  useGLTF,
  Text,
  MeshTransmissionMaterial,
  useTexture,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

// Function to apply color, saturation, and brightness adjustments to the texture
const adjustTexture = (texture, color, saturation, brightness) => {
  const textureClone = texture.clone();
  textureClone.color = new THREE.Color(color);
  textureClone.encoding = THREE.sRGBEncoding;
  textureClone.needsUpdate = true;

  return textureClone;
};

const Model = () => {
  const mesh = useRef();
  const { viewport } = useThree();
  const { nodes } = useGLTF("/images/roca.glb");

  const selvaTexture = useTexture("/images/selva.jpg");
  const envMap = useTexture("/images/selva.jpg"); // Example for reflective environment mapping

  const materialRef = useRef();

  const [hovered, setHovered] = useState(false);
  const [roughness, setRoughness] = useState(0); // Dynamic roughness state

  // Leva controls for material and physics properties
  const materialProps = useControls({
    thickness: { value: 1.4, min: 0, max: 5, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1 },
    ior: { value: 1.18, min: 1, max: 2.5 },
    chromaticAberration: { value: 0.03, min: 0, max: 1 },
    attenuation: { value: 0.3, min: 0, max: 1 },
    backside: { value: true },
    color: "#ffffff", // Color tint of the material
    saturation: { value: 1, min: 0, max: 2 }, // Saturation control
    brightness: { value: 1, min: 0, max: 2 }, // Brightness control
    metalness: { value: 0, min: 0, max: 1 }, // Metalness (reflectivity)
    emissive: { value: "#000025" }, // Emissive color (self-illumination)
    envMapIntensity: { value: 0.5, min: 0, max: 1 }, // Environment map intensity for reflection
    displacementScale: { value: 0.1, min: 0, max: 1 }, // Displacement effect for surface distortion
    distortionAmount: { value: 0.01, min: 0, max: 0.1 }, // Control the distortion amount
  });

  useFrame(() => {
    const target = hovered ? 0.22 : 0;
    setRoughness((prev) => THREE.MathUtils.lerp(prev, target, 0.03));

    if (materialRef.current) {
      materialRef.current.roughness = roughness;
    }

    if (mesh.current) {
      mesh.current.rotation.x += 0.001;
      mesh.current.rotation.y += 0.001;
    }

    // Smooth distortion effect when hovered (apply very little distortion and smooth transition)
    if (mesh.current) {
      const distortion = hovered ? materialProps.distortionAmount : 0;

      // Smooth transition with lerp
      mesh.current.scale.x = THREE.MathUtils.lerp(
        mesh.current.scale.x,
        2.2 + distortion,
        0.1 // Smooth transition speed
      );
      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        2.2 + distortion,
        0.1 // Smooth transition speed
      );
      mesh.current.scale.z = THREE.MathUtils.lerp(
        mesh.current.scale.z,
        2.2 + distortion,
        0.1 // Smooth transition speed
      );
    }
  });

  // Adjust texture based on material properties (color, saturation, brightness)
  const adjustedTexture = adjustTexture(
    selvaTexture,
    materialProps.color,
    materialProps.saturation,
    materialProps.brightness
  );

  return (
    <group>
      <Text
        font="fonts/HelveticaNeueMedium.otf"
        position={[0, 0, 0]}
        fontSize={0.75}
        color="#ffe74c"
      >
        cumbre
      </Text>

      <mesh
        ref={mesh}
        {...nodes.Sphere}
        scale={viewport.width / 5}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <MeshTransmissionMaterial
          ref={materialRef}
          {...materialProps}
          roughness={roughness}
          transparent
          background={adjustedTexture} // Use adjusted texture here
          emissive={new THREE.Color(materialProps.emissive)} // Emissive color
          metalness={materialProps.metalness} // Metalness for reflectivity
          envMap={envMap} // Environment map for reflections
          envMapIntensity={materialProps.envMapIntensity} // Environment map reflection intensity
          displacementScale={materialProps.displacementScale} // Surface displacement effect
        />
      </mesh>
    </group>
  );
};

export default Model;
