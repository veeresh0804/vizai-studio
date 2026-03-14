import type { VisualizeResponse, SceneBlueprint } from "@/types/api";

const MOCK_SCENES: Record<string, SceneBlueprint> = {
  "solar system": {
    meta: { name: "Solar System", description: "A simplified model of our solar system" },
    environment: {
      background: "#050510",
      lighting: {
        ambient: { color: "#404060", intensity: 0.3 },
        directional: { color: "#fffae0", intensity: 1.5, position: [0, 0, 0] },
      },
    },
    primitives: [
      { type: "sphere", position: [0, 0, 0], scale: [1.2, 1.2, 1.2], color: "#ffcc00", label: "Sun" },
      { type: "sphere", position: [2.5, 0, 0], scale: [0.2, 0.2, 0.2], color: "#a0522d", label: "Mercury" },
      { type: "sphere", position: [3.5, 0, 0.5], scale: [0.35, 0.35, 0.35], color: "#daa520", label: "Venus" },
      { type: "sphere", position: [4.8, 0, -0.3], scale: [0.4, 0.4, 0.4], color: "#4169e1", label: "Earth" },
      { type: "sphere", position: [6, 0, 0.8], scale: [0.3, 0.3, 0.3], color: "#cd5c5c", label: "Mars" },
      { type: "sphere", position: [8, 0, -0.5], scale: [0.8, 0.8, 0.8], color: "#d2691e", label: "Jupiter" },
      { type: "sphere", position: [10, 0, 0.3], scale: [0.7, 0.7, 0.7], color: "#f4a460", label: "Saturn" },
      { type: "torus", position: [10, 0, 0.3], rotation: [1.3, 0, 0], scale: [1.1, 1.1, 0.05], color: "#c4a35a", label: "Saturn Ring" },
    ],
    assets: [],
  },
  default: {
    meta: { name: "Concept Visualization" },
    environment: {
      background: "#0a0a1a",
      lighting: {
        ambient: { color: "#606080", intensity: 0.5 },
        directional: { color: "#ffffff", intensity: 1, position: [5, 5, 5] },
      },
    },
    primitives: [
      { type: "box", position: [0, 0, 0], scale: [1, 1, 1], color: "#38bdf8", label: "Core" },
      { type: "sphere", position: [2, 1, 0], scale: [0.5, 0.5, 0.5], color: "#22c55e", label: "Node A" },
      { type: "cylinder", position: [-2, 0, 1], scale: [0.3, 1.5, 0.3], color: "#a78bfa", label: "Connector" },
      { type: "cone", position: [0, 2, -1], scale: [0.5, 1, 0.5], color: "#f472b6", label: "Pointer" },
      { type: "torus", position: [0, 0, 0], rotation: [1.57, 0, 0], scale: [2, 2, 0.1], color: "#38bdf8", label: "Orbit" },
    ],
    assets: [],
  },
};

export async function visualizeConcept(query: string): Promise<VisualizeResponse> {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 800));

  const key = query.toLowerCase().trim();
  const scene = MOCK_SCENES[key] || MOCK_SCENES["default"];
  const isKnown = key in MOCK_SCENES;

  return {
    success: true,
    type: "scene",
    data: scene,
    explanation: isKnown
      ? `The ${query} visualization was generated based on known structural data. The model represents key components with accurate spatial relationships and proportional scaling.`
      : `A procedural visualization was generated for "${query}" using geometric primitives. The AI pipeline created an abstract representation to help explore the concept spatially.`,
    processingTime: 800 + Math.floor(Math.random() * 800),
    source: isKnown ? "search" : "generated",
    candidates: [
      { name: `${query} Primary Model`, confidence: 0.82, source: "Sketchfab" },
      { name: `${query} Simplified`, confidence: 0.71, source: "TurboSquid" },
      { name: `${query} Educational`, confidence: 0.65, source: "Generated" },
    ],
    confidence: isKnown ? 0.83 : 0.67,
    labels: isKnown
      ? [
          { name: "Sun", position: [0, 1.8, 0] as [number, number, number], description: "The Sun is a giant ball of hot gas! It gives light and warmth to all the planets." },
          { name: "Earth", position: [4.8, 0.8, -0.3] as [number, number, number], description: "Earth is our home! It has oceans, mountains, and is the only planet we know has life." },
          { name: "Mars", position: [6, 0.6, 0.8] as [number, number, number], description: "Mars is called the Red Planet because of its rusty red color. Maybe humans will visit someday!" },
          { name: "Jupiter", position: [8, 1.2, -0.5] as [number, number, number], description: "Jupiter is the biggest planet! It has a giant storm called the Great Red Spot." },
          { name: "Saturn Ring", position: [10, 1, 0.3] as [number, number, number], description: "Saturn has beautiful rings made of ice and rock pieces orbiting around it!" },
        ]
      : [
          { name: "Core", position: [0, 1, 0] as [number, number, number], description: "This is the central element of the visualization." },
          { name: "Node A", position: [2, 1.8, 0] as [number, number, number], description: "A connected node representing a related concept." },
        ],
  };
}
