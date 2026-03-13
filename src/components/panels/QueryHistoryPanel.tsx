import { motion } from "framer-motion";
import { Clock, X } from "lucide-react";
import { useQueryHistoryStore } from "@/store/useQueryHistoryStore";
import { useVisualizationStore } from "@/store/useVisualizationStore";

interface Props {
  onResubmit: (query: string) => void;
}

export default function QueryHistoryPanel({ onResubmit }: Props) {
  const { history, clearHistory } = useQueryHistoryStore();
  const { loading } = useVisualizationStore();

  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Recent Queries</h3>
        <button
          onClick={clearHistory}
          className="ml-auto p-1 hover:bg-secondary rounded transition-colors"
          title="Clear history"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      <div className="space-y-1">
        {history.map((q, i) => (
          <button
            key={i}
            disabled={loading}
            onClick={() => onResubmit(q)}
            className="w-full text-left text-xs font-mono px-2 py-1.5 rounded-md bg-secondary/30 hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground disabled:opacity-50 truncate"
          >
            {q}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
