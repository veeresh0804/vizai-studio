import { motion } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function PipelineVisualization() {
  const { pipelineSteps, loading } = useVisualizationStore();

  if (!loading && pipelineSteps.every((s) => s.status === "pending")) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-3 flex items-center gap-1 overflow-x-auto scrollbar-thin"
    >
      <span className="text-xs font-mono text-muted-foreground mr-2 whitespace-nowrap">Pipeline:</span>
      {pipelineSteps.map((step, i) => (
        <div key={step.id} className="flex items-center gap-1">
          <div
            className={
              step.status === "done"
                ? "pipeline-step-done"
                : step.status === "active"
                ? "pipeline-step-active"
                : "pipeline-step-pending"
            }
          >
            {step.status === "done" ? (
              <Check className="w-3.5 h-3.5" />
            ) : step.status === "active" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Circle className="w-3.5 h-3.5" />
            )}
            <span className="whitespace-nowrap">{step.label}</span>
          </div>
          {i < pipelineSteps.length - 1 && (
            <span className="text-muted-foreground/40 mx-1">→</span>
          )}
        </div>
      ))}
    </motion.div>
  );
}
