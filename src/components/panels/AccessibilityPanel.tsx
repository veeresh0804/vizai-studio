import { motion } from "framer-motion";
import { Accessibility, Volume2, Shapes, Contrast } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function AccessibilityPanel() {
  const { highContrast, simplifiedGeometry, toggleHighContrast, toggleSimplifiedGeometry, result } = useVisualizationStore();

  const narrate = () => {
    if (result?.explanation && "speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(result.explanation);
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Accessibility className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Accessibility Tools</h3>
      </div>
      <div className="space-y-2">
        <button
          onClick={narrate}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors border border-border/30"
        >
          <Volume2 className="w-4 h-4 text-primary" />
          Narrate Explanation
        </button>
        <button
          onClick={toggleSimplifiedGeometry}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors border ${
            simplifiedGeometry ? "bg-primary/20 border-primary/30 text-primary" : "bg-secondary/50 border-border/30 text-foreground hover:bg-secondary"
          }`}
        >
          <Shapes className="w-4 h-4" />
          Simplified Geometry
        </button>
        <button
          onClick={toggleHighContrast}
          className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors border ${
            highContrast ? "bg-primary/20 border-primary/30 text-primary" : "bg-secondary/50 border-border/30 text-foreground hover:bg-secondary"
          }`}
        >
          <Contrast className="w-4 h-4" />
          High Contrast Mode
        </button>
      </div>
    </motion.div>
  );
}
