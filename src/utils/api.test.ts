import { describe, it, expect, vi, beforeEach } from "vitest";
import { visualizeConcept } from "@/utils/api";
import {
  mockGlbResponse,
  mockSceneResponse,
  mockJsonExplanationResponse,
  mockJsonExplanationNoTitleResponse,
  mockResponseWithDataLabels,
  mockMinimalResponse,
  mockLabels,
} from "@/test/mocks/apiResponses";

// Helper: configure fetch to resolve with a JSON payload
function mockFetch(payload: unknown, ok = true, status = 200) {
  global.fetch = vi.fn().mockResolvedValueOnce({
    ok,
    status,
    json: async () => payload,
  } as unknown as Response);
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("visualizeConcept", () => {
  it("sends a POST request to the correct API endpoint", async () => {
    mockFetch(mockGlbResponse);
    await visualizeConcept("solar system");

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, options] = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe("https://ai-3d-backend-526063550551.us-central1.run.app/visualize");
    expect(options.method).toBe("POST");
    expect(options.headers).toEqual({ "Content-Type": "application/json" });
    const body = JSON.parse(options.body);
    expect(body.query).toBe("solar system");
    expect(body.style).toBe("realistic");
    expect(body.complexity).toBe("medium");
  });

  it("returns a GLB type response with correct fields", async () => {
    mockFetch(mockGlbResponse);
    const result = await visualizeConcept("solar system");

    expect(result.success).toBe(true);
    expect(result.type).toBe("glb");
    expect(result.data).toEqual({ url: "https://example.com/model.glb" });
    expect(result.explanation).toBe("A realistic 3D model of the solar system.");
    expect(result.processingTime).toBe(1200);
    expect(result.source).toBe("search");
    expect(result.candidates).toHaveLength(2);
    expect(result.confidence).toBe(0.95);
  });

  it("returns a procedural scene response", async () => {
    mockFetch(mockSceneResponse);
    const result = await visualizeConcept("solar system");

    expect(result.type).toBe("scene");
    expect(result.source).toBe("generated");
    expect(result.labels).toEqual(mockLabels);
  });

  it("parses a JSON-encoded explanation string into 'title: explanation' format", async () => {
    mockFetch(mockJsonExplanationResponse);
    const result = await visualizeConcept("solar system");

    expect(result.explanation).toBe("Solar System: Our star and its orbiting planets.");
  });

  it("parses a JSON explanation string with no title field", async () => {
    mockFetch(mockJsonExplanationNoTitleResponse);
    const result = await visualizeConcept("concept");

    expect(result.explanation).toBe("Just an explanation without a title.");
  });

  it("returns plain string explanation unchanged", async () => {
    mockFetch({ ...mockGlbResponse, explanation: "Plain text explanation" });
    const result = await visualizeConcept("concept");

    expect(result.explanation).toBe("Plain text explanation");
  });

  it("falls back to empty array for candidates when missing", async () => {
    mockFetch(mockMinimalResponse);
    const result = await visualizeConcept("minimal");

    expect(result.candidates).toEqual([]);
  });

  it("falls back to default confidence 0.75 when missing", async () => {
    mockFetch(mockMinimalResponse);
    const result = await visualizeConcept("minimal");

    expect(result.confidence).toBe(0.75);
  });

  it("falls back to empty array for labels when missing from both root and data", async () => {
    mockFetch(mockMinimalResponse);
    const result = await visualizeConcept("minimal");

    expect(result.labels).toEqual([]);
  });

  it("extracts labels from response.data when top-level labels absent", async () => {
    mockFetch(mockResponseWithDataLabels);
    const result = await visualizeConcept("scene with labels");

    expect(result.labels).toEqual(mockLabels);
  });

  it("throws an error with status code when API responds with non-OK status", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as unknown as Response);

    await expect(visualizeConcept("fail")).rejects.toThrow("API error: 500");
  });

  it("throws an error on network failure", async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

    await expect(visualizeConcept("fail")).rejects.toThrow("Network error");
  });
});
