import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function MetricsPanel() {
  const { result } = useVisualizationStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">System Metrics</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Processing Time</span>
          <span className="font-mono text-foreground">{result?.processingTime ? `${result.processingTime} ms` : "—"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Source</span>
          <span className={`font-mono ${result?.source === "generated" ? "text-accent" : "text-primary"}`}>
            {result?.source || "—"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Type</span>
          <span className="font-mono text-foreground">{result?.type || "—"}</span>
        </div>
      </div>
    </motion.div>
  );
}
