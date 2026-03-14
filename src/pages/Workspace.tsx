import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { useQueryHistoryStore } from "@/store/useQueryHistoryStore";
import { visualizeConcept } from "@/utils/api";
import ViewerContainer from "@/components/viewer/ViewerContainer";
import PipelineVisualization from "@/components/panels/PipelineVisualization";
import CandidatePanel from "@/components/panels/CandidatePanel";
import ConfidencePanel from "@/components/panels/ConfidencePanel";
import ExplanationPanel from "@/components/panels/ExplanationPanel";
import MetricsPanel from "@/components/panels/MetricsPanel";
import AccessibilityPanel from "@/components/panels/AccessibilityPanel";
import SceneInspectorPanel from "@/components/panels/SceneInspectorPanel";
import QueryHistoryPanel from "@/components/panels/QueryHistoryPanel";

export default function Workspace() {
  const navigate = useNavigate();
  const { query, setQuery, loading, setLoading, setResult, setPipelineSteps, result } = useVisualizationStore();
  const { addQuery } = useQueryHistoryStore();
  const [searchInput, setSearchInput] = useState(query);

  const runVisualization = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);

    const steps = [
      { id: "retrieval", label: "Retrieval", status: "active" as const },
      { id: "clip", label: "CLIP Validation", status: "pending" as const },
      { id: "ranking", label: "Ranking", status: "pending" as const },
      { id: "render", label: "Rendering", status: "pending" as const },
    ];
    setPipelineSteps(steps);

    // Simulate pipeline progression
    await new Promise((r) => setTimeout(r, 400));
    setPipelineSteps([
      { id: "retrieval", label: "Retrieval", status: "done" },
      { id: "clip", label: "CLIP Validation", status: "active" },
      { id: "ranking", label: "Ranking", status: "pending" },
      { id: "render", label: "Rendering", status: "pending" },
    ]);

    await new Promise((r) => setTimeout(r, 400));
    setPipelineSteps([
      { id: "retrieval", label: "Retrieval", status: "done" },
      { id: "clip", label: "CLIP Validation", status: "done" },
      { id: "ranking", label: "Ranking", status: "active" },
      { id: "render", label: "Rendering", status: "pending" },
    ]);

    addQuery(q);
    const res = await visualizeConcept(q);

    setPipelineSteps([
      { id: "retrieval", label: "Retrieval", status: "done" },
      { id: "clip", label: "CLIP Validation", status: "done" },
      { id: "ranking", label: "Ranking", status: "done" },
      { id: "render", label: "Rendering", status: "done" },
    ]);

    setResult(res);
    setLoading(false);
  }, [setLoading, setResult, setPipelineSteps]);

  useEffect(() => {
    if (query && !result) {
      runVisualization(query);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput.trim());
      runVisualization(searchInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/40 backdrop-blur-xl px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm gradient-text">PratibimbAI</span>
        </div>
        <form onSubmit={handleSearch} className="flex-1 max-w-md ml-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search concept..."
              className="w-full bg-secondary/50 border border-border/30 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground/50 transition-colors"
            />
          </div>
        </form>
        {query && (
          <span className="text-xs font-mono text-muted-foreground ml-auto hidden sm:block">
            Query: "{query}"
          </span>
        )}
      </header>

      {/* Pipeline */}
      <div className="px-4 pt-3">
        <PipelineVisualization />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* 3D Viewer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 lg:min-h-0"
          style={{ minHeight: "400px", height: "calc(100vh - 160px)" }}
        >
          <ViewerContainer />
        </motion.div>

        {/* Side Panels */}
        <div className="w-full lg:w-80 xl:w-96 space-y-3 overflow-y-auto scrollbar-thin max-h-[calc(100vh-120px)]">
          <CandidatePanel />
          <ConfidencePanel />
          <ExplanationPanel />
          <SceneInspectorPanel />
          <MetricsPanel />
          <QueryHistoryPanel onResubmit={(q) => {
            setSearchInput(q);
            setQuery(q);
            runVisualization(q);
          }} />
          <AccessibilityPanel />
        </div>
      </div>
    </div>
  );
}
