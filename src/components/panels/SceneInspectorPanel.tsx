import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import type { SceneBlueprint } from "@/types/api";

const typeIcons: Record<string, string> = {
  box: "▣",
  sphere: "●",
  cylinder: "▮",
  cone: "▲",
  torus: "◎",
  plane: "▬",
};

export default function SceneInspectorPanel() {
  const { result } = useVisualizationStore();

  if (!result || result.type !== "scene") return null;

  const blueprint = result.data as SceneBlueprint;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel-hover p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Scene Structure</h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {blueprint.primitives.length} primitives
        </span>
      </div>
      <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin">
        {blueprint.primitives.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-sm px-2 py-1 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <span className="text-primary font-mono text-xs w-5 text-center">
              {typeIcons[p.type] || "?"}
            </span>
            <span className="text-foreground text-xs font-medium">
              {p.label || `Primitive ${i + 1}`}
            </span>
            <span className="ml-auto text-muted-foreground text-xs font-mono">
              {p.type}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
