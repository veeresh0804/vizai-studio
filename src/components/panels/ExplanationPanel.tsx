import { motion } from "framer-motion";
import { Brain } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function ExplanationPanel() {
  const { result } = useVisualizationStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI Explanation</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {result?.explanation || "Submit a query to see AI-generated explanation."}
      </p>
    </motion.div>
  );
}
