// Test fixtures for API response mocking
import type { VisualizeResponse, SceneBlueprint, CandidateModel, SceneLabel } from "@/types/api";

export const mockCandidates: CandidateModel[] = [
  { name: "Solar System 3D", confidence: 0.95, source: "sketchfab" },
  { name: "Planetary Model", confidence: 0.82, source: "poly" },
];

export const mockLabels: SceneLabel[] = [
  {
    name: "Sun",
    position: [0, 0, 0],
    description: "The central star of our solar system",
    audio: "https://example.com/sun.mp3",
  },
  {
    name: "Earth",
    position: [5, 0, 0],
    description: "The third planet from the Sun",
  },
];

// GLB type response – direct 3D model URL
export const mockGlbResponse: VisualizeResponse = {
  success: true,
  type: "glb",
  data: { url: "https://example.com/model.glb" },
  explanation: "A realistic 3D model of the solar system.",
  processingTime: 1200,
  source: "search",
  candidates: mockCandidates,
  confidence: 0.95,
  labels: [],
};

// Procedural scene blueprint response
export const mockSceneBlueprint: SceneBlueprint = {
  meta: { title: "Solar System" },
  environment: {
    background: "#000011",
    lighting: {
      ambient: { color: "#ffffff", intensity: 0.3 },
      directional: { color: "#ffff80", intensity: 1.0, position: [10, 20, 10] },
    },
  },
  primitives: [
    { type: "sphere", position: [0, 0, 0], scale: [2, 2, 2], color: "#ffaa00", label: "Sun" },
    { type: "sphere", position: [5, 0, 0], scale: [0.5, 0.5, 0.5], color: "#0044ff", label: "Earth" },
  ],
  assets: [],
};

export const mockSceneResponse: VisualizeResponse = {
  success: true,
  type: "scene",
  data: mockSceneBlueprint,
  explanation: "A procedurally generated solar system scene.",
  processingTime: 800,
  source: "generated",
  candidates: [],
  confidence: 0.8,
  labels: mockLabels,
};

// Response where explanation is a JSON-encoded string
export const mockJsonExplanationResponse = {
  success: true,
  type: "glb",
  data: { url: "https://example.com/model.glb" },
  explanation: JSON.stringify({ title: "Solar System", explanation: "Our star and its orbiting planets." }),
  processingTime: 900,
  source: "search",
  candidates: mockCandidates,
  confidence: 0.9,
  labels: [],
};

// Response where explanation JSON has no title
export const mockJsonExplanationNoTitleResponse = {
  success: true,
  type: "glb",
  data: { url: "https://example.com/model.glb" },
  explanation: JSON.stringify({ explanation: "Just an explanation without a title." }),
  processingTime: 500,
  source: "search",
  candidates: [],
  confidence: 0.75,
  labels: [],
};

// Response with labels embedded in data
export const mockResponseWithDataLabels = {
  success: true,
  type: "scene",
  data: { ...mockSceneBlueprint, labels: mockLabels },
  explanation: "Scene with labels in data.",
  processingTime: 700,
  source: "generated",
  candidates: [],
  confidence: 0.85,
  // no top-level labels
};

// Response missing optional fields (candidates, confidence, labels)
export const mockMinimalResponse = {
  success: true,
  type: "glb",
  data: { url: "https://example.com/minimal.glb" },
  explanation: "Minimal response",
  processingTime: 300,
  source: "search",
};

// Error response from the API
export const mockErrorResponse = {
  success: false,
  error: "Query not understood",
  status: 422,
};
