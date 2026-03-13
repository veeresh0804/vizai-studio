import { create } from "zustand";

interface QueryHistoryState {
  history: string[];
  addQuery: (q: string) => void;
  clearHistory: () => void;
}

export const useQueryHistoryStore = create<QueryHistoryState>((set) => ({
  history: [],
  addQuery: (q) =>
    set((state) => ({
      history: [q, ...state.history.filter((h) => h !== q)].slice(0, 10),
    })),
  clearHistory: () => set({ history: [] }),
}));
