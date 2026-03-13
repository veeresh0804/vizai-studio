import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { SceneBlueprint, ScenePrimitive } from "@/types/api";
import * as THREE from "three";

function PrimitiveComponent({ primitive }: { primitive: ScenePrimitive }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { type, position, rotation, scale, color } = primitive;

  const geometry = (() => {
    switch (type) {
      case "box": return <boxGeometry args={[1, 1, 1]} />;
      case "sphere": return <sphereGeometry args={[1, 32, 32]} />;
      case "cylinder": return <cylinderGeometry args={[1, 1, 1, 32]} />;
      case "cone": return <coneGeometry args={[1, 1, 32]} />;
      case "torus": return <torusGeometry args={[1, 0.3, 16, 48]} />;
      case "plane": return <planeGeometry args={[1, 1]} />;
      default: return <boxGeometry args={[1, 1, 1]} />;
    }
  })();

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation ? [rotation[0], rotation[1], rotation[2]] : undefined}
      scale={scale}
    >
      {geometry}
      <meshStandardMaterial color={color || "#38bdf8"} roughness={0.4} metalness={0.3} />
    </mesh>
  );
}

interface Props {
  blueprint: SceneBlueprint;
}

export default function SceneBlueprintRenderer({ blueprint }: Props) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const env = blueprint.environment;

  return (
    <group ref={groupRef}>
      <ambientLight
        color={env?.lighting?.ambient?.color || "#606080"}
        intensity={env?.lighting?.ambient?.intensity ?? 0.5}
      />
      <directionalLight
        color={env?.lighting?.directional?.color || "#ffffff"}
        intensity={env?.lighting?.directional?.intensity ?? 1}
        position={env?.lighting?.directional?.position || [5, 5, 5]}
      />
      {blueprint.primitives.map((p, i) => (
        <PrimitiveComponent key={i} primitive={p} />
      ))}
    </group>
  );
}
