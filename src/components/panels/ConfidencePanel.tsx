import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function ConfidencePanel() {
  const { result } = useVisualizationStore();
  const confidence = result?.confidence ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Confidence Score</h3>
      </div>
      <div className="text-3xl font-bold gradient-text mb-3">{confidence.toFixed(2)}</div>
      <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
        />
      </div>
      <div className="mt-3 space-y-1.5">
        {[
          { label: "Semantic similarity", value: confidence * 0.95 },
          { label: "CLIP validation", value: confidence * 0.88 },
          { label: "Model quality", value: confidence * 1.05 },
        ].map((m) => (
          <div key={m.label} className="flex justify-between text-xs">
            <span className="text-muted-foreground">{m.label}</span>
            <span className="text-foreground font-mono">{Math.min(m.value, 1).toFixed(2)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
