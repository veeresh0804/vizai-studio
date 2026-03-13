import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import { motion } from "framer-motion";
import { RotateCcw, Maximize2, Box } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import SceneBlueprintRenderer from "./SceneBlueprintRenderer";
import ModelLoader from "./ModelLoader";
import type { SceneBlueprint } from "@/types/api";
import { useState, useRef, useCallback } from "react";

export default function ViewerContainer() {
  const { result, loading } = useVisualizationStore();
  const [wireframe, setWireframe] = useState(false);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-panel relative w-full h-full min-h-[400px] overflow-hidden"
    >
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <span className="text-xs font-mono text-muted-foreground bg-background/60 px-2 py-1 rounded">
          3D Visualization Viewer
        </span>
        {result && (
          <span className={`text-xs font-mono px-2 py-1 rounded ${result.source === "generated" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
            {result.source === "generated" ? "Generated Scene" : "Retrieved Model"}
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 flex gap-1">
        <button onClick={resetCamera} className="p-2 bg-background/60 hover:bg-background/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Reset Camera">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={() => setWireframe(!wireframe)} className={`p-2 rounded-lg transition-colors ${wireframe ? "bg-primary/20 text-primary" : "bg-background/60 hover:bg-background/80 text-muted-foreground hover:text-foreground"}`} title="Wireframe">
          <Box className="w-4 h-4" />
        </button>
        <button className="p-2 bg-background/60 hover:bg-background/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Fullscreen">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted-foreground font-mono">Running AI retrieval pipeline...</p>
          </div>
        </div>
      )}

      <Canvas camera={{ position: [6, 4, 6], fov: 50 }} style={{ background: result?.type === "scene" ? ((result.data as SceneBlueprint).environment?.background || "#0a0a1a") : "#0a0a1a" }}>
        <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
        {!result && (
          <>
            <ambientLight intensity={0.3} />
            <directionalLight position={[5, 5, 5]} intensity={0.5} />
            <Grid infiniteGrid fadeDistance={20} cellColor="#1e293b" sectionColor="#334155" />
          </>
        )}
        {result?.type === "scene" && <SceneBlueprintRenderer blueprint={result.data as SceneBlueprint} />}
        {result?.type === "glb" && <ModelLoader modelUrl={(result.data as { url: string }).url} />}
      </Canvas>

      {!result && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-muted-foreground/40 text-sm font-mono">Enter a concept to begin visualization</p>
        </div>
      )}
    </motion.div>
  );
}
