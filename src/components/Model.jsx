import React, { useRef, useState } from "react";
import {
  useGLTF,
  Text,
  MeshTransmissionMaterial,
  useTexture,
} from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

// Background image component
const Background = ({ imageUrl }) => {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const { viewport } = useThree();

  return (
    <mesh
      scale={[viewport.width * 2, viewport.height * 2, 1]}
      position={[0, 0, -5]}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} depthWrite={false} />
    </mesh>
  );
};

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
  const materialRef = useRef();
  const { viewport } = useThree();
  const { nodes } = useGLTF("/images/roca.glb");

  const selvaTexture = useTexture("/images/pintura3.jpg");
  const envMap = useTexture("/images/selva.jpg");

  const [hovered, setHovered] = useState(false);
  const [roughness, setRoughness] = useState(0);

  const materialProps = useControls({
    thickness: { value: 1.4, min: 0, max: 5, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1 },
    ior: { value: 1.18, min: 1, max: 2.5 },
    chromaticAberration: { value: 0.03, min: 0, max: 1 },
    attenuation: { value: 0.3, min: 0, max: 1 },
    backside: { value: true },
    color: "#ebeaea",
    saturation: { value: 1, min: 0, max: 2 },
    brightness: { value: 1, min: 0, max: 2 },
    metalness: { value: 0, min: 0, max: 1 },
    emissive: { value: "#000000" },
    envMapIntensity: { value: 0.5, min: 0, max: 1 },
    displacementScale: { value: 0.1, min: 0, max: 1 },
    distortionAmount: { value: 0.01, min: 0, max: 0.1 },
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

      const distortion = hovered ? materialProps.distortionAmount : 0;

      mesh.current.scale.x = THREE.MathUtils.lerp(
        mesh.current.scale.x,
        2.2 + distortion,
        0.1
      );
      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        2.2 + distortion,
        0.1
      );
      mesh.current.scale.z = THREE.MathUtils.lerp(
        mesh.current.scale.z,
        2.2 + distortion,
        0.1
      );
    }
  });

  // Adjusted texture for inside material (currently not in use)
  const adjustedTexture = adjustTexture(
    selvaTexture,
    materialProps.color,
    materialProps.saturation,
    materialProps.brightness
  );

  return (
    <>
      <Background imageUrl="/images/pintura.jpg" />

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
            background={adjustedTexture} // 🔧 Commented out for testing
            emissive={new THREE.Color(materialProps.emissive)}
            metalness={materialProps.metalness}
            envMap={envMap}
            envMapIntensity={materialProps.envMapIntensity}
            displacementScale={materialProps.displacementScale}
          />
        </mesh>
      </group>
    </>
  );
};

export default Model;
