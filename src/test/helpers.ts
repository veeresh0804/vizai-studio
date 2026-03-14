// Reusable test helpers for setting up fetch mocks and generating test data
import { vi } from "vitest";
import type { VisualizeResponse } from "@/types/api";

/**
 * Configures global.fetch to resolve with the provided JSON payload.
 * Returns the mock function so callers can make assertions on it.
 */
export function setupFetchMock(payload: unknown, ok = true, status = 200) {
  const mockFetch = vi.fn().mockResolvedValueOnce({
    ok,
    status,
    json: async () => payload,
  } as unknown as Response);
  global.fetch = mockFetch;
  return mockFetch;
}

/**
 * Configures global.fetch to reject with a network-level error.
 */
export function setupFetchNetworkError(message = "Network error") {
  const mockFetch = vi.fn().mockRejectedValueOnce(new Error(message));
  global.fetch = mockFetch;
  return mockFetch;
}

/**
 * Creates a minimal valid VisualizeResponse for use in component/store tests.
 */
export function createMockVisualizationResponse(
  overrides: Partial<VisualizeResponse> = {}
): VisualizeResponse {
  return {
    success: true,
    type: "glb",
    data: { url: "https://example.com/model.glb" },
    explanation: "A test visualization",
    processingTime: 500,
    source: "search",
    candidates: [],
    confidence: 0.9,
    labels: [],
    ...overrides,
  };
}
