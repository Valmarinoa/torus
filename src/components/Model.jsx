import React, { useRef, useState } from "react";
import {
  useGLTF,
  Text,
  MeshTransmissionMaterial,
  useTexture,
} from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SRGBColorSpace } from "three";

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
  textureClone.colorSpace = SRGBColorSpace;
  textureClone.needsUpdate = true;
  return textureClone;
};

const Model = () => {
  const mesh = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();
  const { nodes } = useGLTF("/images/roca.glb");

  const selvaTexture = useTexture("/images/pintura.jpg");
  const envMap = useTexture("/images/selva.jpg");

  const [hovered, setHovered] = useState(false);
  const [roughness, setRoughness] = useState(0);

  // Hardcoded material properties (previously from Leva)
  const materialProps = {
    thickness: 1.6,
    transmission: 1,
    ior: 1.18,
    chromaticAberration: 0.03,
    attenuation: 0.3,
    backside: true,
    color: "#ebeaea",
    saturation: 1,
    brightness: 1,
    metalness: 0,
    emissive: "#000000",
    envMapIntensity: 0.5,
    displacementScale: 0.1,
    distortionAmount: 0.01,
  };

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
        baseScale + distortion,
        0.1
      );
      mesh.current.scale.y = THREE.MathUtils.lerp(
        mesh.current.scale.y,
        baseScale + distortion,
        0.1
      );
      mesh.current.scale.z = THREE.MathUtils.lerp(
        mesh.current.scale.z,
        baseScale + distortion,
        0.1
      );
    }
  });

  const baseScale = Math.min(viewport.width, viewport.height) / 2.75;

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

        {nodes.Sphere && (
          <mesh
            ref={mesh}
            {...nodes.Sphere}
            scale={baseScale}
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
              // background={adjustedTexture} // 🔧 Still commented for testing
              emissive={new THREE.Color(materialProps.emissive)}
              metalness={materialProps.metalness}
              envMap={envMap}
              envMapIntensity={materialProps.envMapIntensity}
              displacementScale={materialProps.displacementScale}
            />
          </mesh>
        )}
      </group>
    </>
  );
};

export default Model;
