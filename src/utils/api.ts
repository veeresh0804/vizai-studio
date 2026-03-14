import type { VisualizeResponse, SceneBlueprint } from "@/types/api";

const API_URL = "https://ai-3d-backend-526063550551.us-central1.run.app/visualize";

export async function visualizeConcept(query: string): Promise<VisualizeResponse> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, style: "realistic", complexity: "medium" }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json = await res.json();

  // Parse explanation if it's a JSON string
  let explanation = json.explanation;
  if (typeof explanation === "string") {
    try {
      const parsed = JSON.parse(explanation);
      explanation = parsed.explanation || parsed.title
        ? `${parsed.title ? parsed.title + ": " : ""}${parsed.explanation || ""}`
        : explanation;
    } catch {
      // already a plain string
    }
  }

  return {
    success: json.success,
    type: json.type,
    data: json.data,
    explanation,
    processingTime: json.processingTime,
    source: json.source,
    candidates: json.candidates || [],
    confidence: json.confidence ?? 0.75,
    labels: json.labels || json.data?.labels || [],
  };
}
