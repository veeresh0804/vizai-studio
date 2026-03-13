import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";

export default function CandidatePanel() {
  const { result, selectedCandidate, setSelectedCandidate } = useVisualizationStore();
  const candidates = result?.candidates || [];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Candidate Models</h3>
      </div>
      {candidates.length === 0 ? (
        <p className="text-xs text-muted-foreground">No candidates yet</p>
      ) : (
        <div className="space-y-2">
          {candidates.map((c, i) => (
            <button
              key={i}
              onClick={() => setSelectedCandidate(i)}
              className={`w-full text-left p-2.5 rounded-lg border transition-all duration-200 ${
                selectedCandidate === i
                  ? "border-primary/50 bg-primary/10"
                  : "border-border/30 bg-secondary/30 hover:border-border/60"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{c.name}</span>
                <span className="text-xs font-mono text-primary">{c.confidence.toFixed(2)}</span>
              </div>
              <span className="text-xs text-muted-foreground">{c.source}</span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
