import { create } from "zustand";
import type { VisualizeResponse, CandidateModel } from "@/types/api";

interface PipelineStep {
  id: string;
  label: string;
  status: "pending" | "active" | "done";
}

interface VisualizationState {
  query: string;
  loading: boolean;
  result: VisualizeResponse | null;
  selectedCandidate: number;
  pipelineSteps: PipelineStep[];
  highContrast: boolean;
  simplifiedGeometry: boolean;

  setQuery: (q: string) => void;
  setLoading: (l: boolean) => void;
  setResult: (r: VisualizeResponse | null) => void;
  setSelectedCandidate: (i: number) => void;
  setPipelineSteps: (s: PipelineStep[]) => void;
  advancePipeline: (stepId: string) => void;
  toggleHighContrast: () => void;
  toggleSimplifiedGeometry: () => void;
  reset: () => void;
}

const defaultPipeline: PipelineStep[] = [
  { id: "retrieval", label: "Retrieval", status: "pending" },
  { id: "clip", label: "CLIP Validation", status: "pending" },
  { id: "ranking", label: "Ranking", status: "pending" },
  { id: "render", label: "Rendering", status: "pending" },
];

export const useVisualizationStore = create<VisualizationState>((set) => ({
  query: "",
  loading: false,
  result: null,
  selectedCandidate: 0,
  pipelineSteps: defaultPipeline,
  highContrast: false,
  simplifiedGeometry: false,

  setQuery: (query) => set({ query }),
  setLoading: (loading) => set({ loading }),
  setResult: (result) => set({ result }),
  setSelectedCandidate: (selectedCandidate) => set({ selectedCandidate }),
  setPipelineSteps: (pipelineSteps) => set({ pipelineSteps }),
  advancePipeline: (stepId) =>
    set((state) => ({
      pipelineSteps: state.pipelineSteps.map((s) =>
        s.id === stepId ? { ...s, status: "done" } : s.status === "pending" && state.pipelineSteps.findIndex((x) => x.id === stepId) < state.pipelineSteps.findIndex((x) => x.id === s.id) ? s : s
      ),
    })),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  toggleSimplifiedGeometry: () => set((s) => ({ simplifiedGeometry: !s.simplifiedGeometry })),
  reset: () => set({ query: "", loading: false, result: null, selectedCandidate: 0, pipelineSteps: defaultPipeline, highContrast: false, simplifiedGeometry: false }),
}));
