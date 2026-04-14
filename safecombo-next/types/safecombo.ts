export type RiskSeverity = "low" | "moderate" | "high";

export interface RiskFinding {
  label: string;
  severity: RiskSeverity;
  probability: number;
  rationale: string;
}

export interface RiskCategory {
  name: string;
  categoryRisk: number;
  severity: RiskSeverity;
  findings: RiskFinding[];
}

export interface PredictionResponse {
  overallScore: number;
  summary: string;
  highRiskCount: number;
  moderateRiskCount: number;
  categories: RiskCategory[];
}