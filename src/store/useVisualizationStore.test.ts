import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { createMockVisualizationResponse } from "@/test/helpers";

// Reset store state before each test so tests are isolated
beforeEach(() => {
  useVisualizationStore.getState().reset();
});

describe("useVisualizationStore – initial state", () => {
  it("starts with empty query", () => {
    const { result } = renderHook(() => useVisualizationStore());
    expect(result.current.query).toBe("");
  });

  it("starts with loading false", () => {
    const { result } = renderHook(() => useVisualizationStore());
    expect(result.current.loading).toBe(false);
  });

  it("starts with null result", () => {
    const { result } = renderHook(() => useVisualizationStore());
    expect(result.current.result).toBeNull();
  });

  it("starts with selectedCandidate 0", () => {
    const { result } = renderHook(() => useVisualizationStore());
    expect(result.current.selectedCandidate).toBe(0);
  });

  it("starts with four pending pipeline steps", () => {
    const { result } = renderHook(() => useVisualizationStore());
    expect(result.current.pipelineSteps).toHaveLength(4);
    result.current.pipelineSteps.forEach((step) =>
      expect(step.status).toBe("pending")
    );
  });

  it("starts with accessibility toggles off", () => {
    const { result } = renderHook(() => useVisualizationStore());
    expect(result.current.highContrast).toBe(false);
    expect(result.current.simplifiedGeometry).toBe(false);
  });
});

describe("useVisualizationStore – setQuery", () => {
  it("updates the query", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.setQuery("solar system"));
    expect(result.current.query).toBe("solar system");
  });
});

describe("useVisualizationStore – setLoading", () => {
  it("sets loading to true", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.setLoading(true));
    expect(result.current.loading).toBe(true);
  });

  it("sets loading back to false", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.setLoading(true));
    act(() => result.current.setLoading(false));
    expect(result.current.loading).toBe(false);
  });
});

describe("useVisualizationStore – setResult", () => {
  it("stores a visualization result", () => {
    const { result } = renderHook(() => useVisualizationStore());
    const mockResult = createMockVisualizationResponse();
    act(() => result.current.setResult(mockResult));
    expect(result.current.result).toEqual(mockResult);
  });

  it("can clear the result by setting null", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.setResult(createMockVisualizationResponse()));
    act(() => result.current.setResult(null));
    expect(result.current.result).toBeNull();
  });
});

describe("useVisualizationStore – setSelectedCandidate", () => {
  it("updates the selected candidate index", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.setSelectedCandidate(2));
    expect(result.current.selectedCandidate).toBe(2);
  });
});

describe("useVisualizationStore – advancePipeline", () => {
  it("marks the specified step as done", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.advancePipeline("retrieval"));
    const step = result.current.pipelineSteps.find((s) => s.id === "retrieval");
    expect(step?.status).toBe("done");
  });

  it("does not change other steps when advancing one", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.advancePipeline("retrieval"));
    const otherSteps = result.current.pipelineSteps.filter((s) => s.id !== "retrieval");
    otherSteps.forEach((step) => expect(step.status).toBe("pending"));
  });

  it("can advance multiple steps independently", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.advancePipeline("retrieval"));
    act(() => result.current.advancePipeline("clip"));
    expect(result.current.pipelineSteps.find((s) => s.id === "retrieval")?.status).toBe("done");
    expect(result.current.pipelineSteps.find((s) => s.id === "clip")?.status).toBe("done");
  });
});

describe("useVisualizationStore – accessibility toggles", () => {
  it("toggles highContrast from false to true", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.toggleHighContrast());
    expect(result.current.highContrast).toBe(true);
  });

  it("toggles highContrast back to false on second call", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.toggleHighContrast());
    act(() => result.current.toggleHighContrast());
    expect(result.current.highContrast).toBe(false);
  });

  it("toggles simplifiedGeometry from false to true", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.toggleSimplifiedGeometry());
    expect(result.current.simplifiedGeometry).toBe(true);
  });

  it("toggles simplifiedGeometry back to false on second call", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => result.current.toggleSimplifiedGeometry());
    act(() => result.current.toggleSimplifiedGeometry());
    expect(result.current.simplifiedGeometry).toBe(false);
  });
});

describe("useVisualizationStore – reset", () => {
  it("resets query, loading, result, and selectedCandidate to defaults", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => {
      result.current.setQuery("solar system");
      result.current.setLoading(true);
      result.current.setResult(createMockVisualizationResponse());
      result.current.setSelectedCandidate(3);
    });
    act(() => result.current.reset());
    expect(result.current.query).toBe("");
    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.selectedCandidate).toBe(0);
  });

  it("resets pipeline steps back to all pending", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => {
      result.current.advancePipeline("retrieval");
      result.current.advancePipeline("clip");
    });
    act(() => result.current.reset());
    result.current.pipelineSteps.forEach((step) =>
      expect(step.status).toBe("pending")
    );
  });

  it("resets accessibility toggles back to false", () => {
    const { result } = renderHook(() => useVisualizationStore());
    act(() => {
      result.current.toggleHighContrast();
      result.current.toggleSimplifiedGeometry();
    });
    act(() => result.current.reset());
    expect(result.current.highContrast).toBe(false);
    expect(result.current.simplifiedGeometry).toBe(false);
  });
});
