export interface SceneBlueprint {
  meta: Record<string, unknown>;
  environment: {
    background?: string;
    lighting?: {
      ambient?: { color?: string; intensity?: number };
      directional?: { color?: string; intensity?: number; position?: [number, number, number] };
    };
  };
  primitives: ScenePrimitive[];
  assets: SceneAsset[];
}

export interface ScenePrimitive {
  type: "box" | "sphere" | "cylinder" | "cone" | "torus" | "plane";
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  label?: string;
}

export interface SceneAsset {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export interface SceneLabel {
  name: string;
  position: [number, number, number];
  description: string;
  audio?: string;
}

export interface VisualizeResponse {
  success: boolean;
  type: "glb" | "scene";
  data: { url: string } | SceneBlueprint;
  explanation: string;
  processingTime: number;
  source: "search" | "generated";
  candidates?: CandidateModel[];
  confidence?: number;
  labels?: SceneLabel[];
}

export interface VisualizeResponse {
  success: boolean;
  type: "glb" | "scene";
  data: { url: string } | SceneBlueprint;
  explanation: string;
  processingTime: number;
  source: "search" | "generated";
  candidates?: CandidateModel[];
  confidence?: number;
}

export interface CandidateModel {
  name: string;
  confidence: number;
  source: string;
}
