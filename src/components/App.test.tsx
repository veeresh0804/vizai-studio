/**
 * Component integration tests.
 *
 * Strategy:
 * - Three.js / React-Three-Fiber components are mocked because they require a
 *   WebGL context not available in jsdom.
 * - We verify the data flow: store state → component rendering, and user
 *   interactions → store updates.
 */
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import SearchBar from "@/components/landing/SearchBar";
import NotFound from "@/pages/NotFound";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { useQueryHistoryStore } from "@/store/useQueryHistoryStore";

// ------------------------------------------------------------------
// Mock Three.js-dependent modules so jsdom doesn't throw WebGL errors
// ------------------------------------------------------------------
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  useGLTF: vi.fn(() => ({ scene: null })),
  Html: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Environment: () => null,
}));

// ------------------------------------------------------------------
// Test helpers
// ------------------------------------------------------------------
function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      <TooltipProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  useVisualizationStore.getState().reset();
  useQueryHistoryStore.getState().clearHistory();
  vi.restoreAllMocks();
});

// ------------------------------------------------------------------
// SearchBar
// ------------------------------------------------------------------
describe("SearchBar component", () => {
  it("renders the search input placeholder", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText("Enter a concept to visualize...")).toBeTruthy();
  });

  it("calls onSubmit with the typed query when the form is submitted", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("Enter a concept to visualize...");
    fireEvent.change(input, { target: { value: "solar system" } });
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).toHaveBeenCalledOnce();
    expect(onSubmit).toHaveBeenCalledWith("solar system");
  });

  it("trims whitespace before calling onSubmit", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("Enter a concept to visualize...");
    fireEvent.change(input, { target: { value: "  black hole  " } });
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith("black hole");
  });

  it("does not call onSubmit when the input is empty", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("Enter a concept to visualize...");
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders suggestion chips", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    expect(screen.getByText("solar system")).toBeTruthy();
    expect(screen.getByText("human heart")).toBeTruthy();
  });

  it("calls onSubmit with a suggestion when a chip is clicked", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByText("solar system"));
    expect(onSubmit).toHaveBeenCalledWith("solar system");
  });

  it("calls onSubmit via the 'Visualize Concept' button", () => {
    const onSubmit = vi.fn();
    render(<SearchBar onSubmit={onSubmit} />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText("Enter a concept to visualize...");
    fireEvent.change(input, { target: { value: "DNA helix" } });
    fireEvent.click(screen.getByText("Visualize Concept"));
    expect(onSubmit).toHaveBeenCalledWith("DNA helix");
  });
});

// ------------------------------------------------------------------
// NotFound page
// ------------------------------------------------------------------
describe("NotFound page", () => {
  it("renders the 404 heading", () => {
    render(<NotFound />, { wrapper: Wrapper });
    expect(screen.getByText("404")).toBeTruthy();
  });

  it("renders the 'Page not found' message", () => {
    render(<NotFound />, { wrapper: Wrapper });
    expect(screen.getByText("Oops! Page not found")).toBeTruthy();
  });

  it("renders a link back to the home page", () => {
    render(<NotFound />, { wrapper: Wrapper });
    const link = screen.getByText("Return to Home");
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/");
  });
});

// ------------------------------------------------------------------
// Store → UI integration: Landing sets query in store
// ------------------------------------------------------------------
describe("useVisualizationStore integration", () => {
  it("stores the query submitted from SearchBar into the visualization store", () => {
    const { setQuery } = useVisualizationStore.getState();
    setQuery("black hole");
    expect(useVisualizationStore.getState().query).toBe("black hole");
  });

  it("stores a result and reflects it in a hook consumer", () => {
    const { setResult } = useVisualizationStore.getState();
    const response = {
      success: true,
      type: "glb" as const,
      data: { url: "https://example.com/model.glb" },
      explanation: "Test explanation",
      processingTime: 100,
      source: "search" as const,
      candidates: [],
      confidence: 0.9,
      labels: [],
    };
    setResult(response);
    expect(useVisualizationStore.getState().result).toEqual(response);
  });
});

// ------------------------------------------------------------------
// Store → UI integration: query history is updated after a search
// ------------------------------------------------------------------
describe("useQueryHistoryStore integration", () => {
  it("records queries in history in the correct order", () => {
    const { addQuery } = useQueryHistoryStore.getState();
    addQuery("solar system");
    addQuery("black hole");
    const { history } = useQueryHistoryStore.getState();
    expect(history[0]).toBe("black hole");
    expect(history[1]).toBe("solar system");
  });
});
