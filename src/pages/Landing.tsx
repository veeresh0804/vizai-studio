import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SearchBar from "@/components/landing/SearchBar";
import ParticleBackground from "@/components/landing/ParticleBackground";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { Sparkles } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { setQuery } = useVisualizationStore();

  const handleSubmit = (query: string) => {
    setQuery(query);
    navigate("/workspace");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      <ParticleBackground />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
          <h1 className="text-5xl md:text-6xl font-bold gradient-text tracking-tight">
            PratibimbAI
          </h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed"
        >
          Transform concepts into interactive 3D visualizations using AI-powered retrieval and procedural generation.
        </motion.p>
      </motion.div>

      <SearchBar onSubmit={handleSubmit} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-16 flex gap-6 text-xs text-muted-foreground/50 font-mono"
      >
        <span>AI Pipeline</span>
        <span>•</span>
        <span>3D Visualization</span>
        <span>•</span>
        <span>Explainable AI</span>
        <span>•</span>
        <span>Accessible</span>
      </motion.div>
    </div>
  );
}
