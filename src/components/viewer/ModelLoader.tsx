import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

interface Props {
  modelUrl: string;
}

function Model({ modelUrl }: Props) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} />;
}

export default function ModelLoader({ modelUrl }: Props) {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model modelUrl={modelUrl} />
    </Suspense>
  );
}
