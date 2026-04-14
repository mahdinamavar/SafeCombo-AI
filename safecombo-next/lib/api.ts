import type { PredictionResponse } from "@/types/safecombo";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function predictDrugCombo(
  drugs: string[],
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ drugs }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Prediction failed: ${response.status} ${text}`);
  }

  return response.json();
}