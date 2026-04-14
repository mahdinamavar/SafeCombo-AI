import __main__
import numpy as np
import torch
import torch.nn as nn
import joblib


def drug_tokenizer(text: str):
    return [d.strip() for d in text.split(",") if d.strip()]


# make the tokenizer visible where the pickle expects it
__main__.drug_tokenizer = drug_tokenizer

device = torch.device("cpu")

# --- Load artifacts ---
tfidf = joblib.load("artifacts/tfidf_vectorizer.pkl")
mlb = joblib.load("artifacts/mlb_binarizer.pkl")
optimal_thresholds = np.load("artifacts/final_purified_thresholds.npy")

PHENOTYPES = list(mlb.classes_)
input_dim = len(tfidf.vocabulary_)


class FinalSafetyPredictor(nn.Module):
    def __init__(self, in_dim: int, out_dim: int):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(in_dim, 512),
            nn.BatchNorm1d(512),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(512, out_dim),
        )

    def forward(self, x):
        return self.network(x)


model = FinalSafetyPredictor(input_dim, len(PHENOTYPES)).to(device)
model.load_state_dict(
    torch.load("artifacts/final_purified_model.pth", map_location=device)
)
model.eval()

HIERARCHY_MAP = {
    "Cardiovascular": [
        "Risk: Arrhythmia",
        "Risk: Heart Failure",
        "Risk: Ischemic Heart Disease",
        "Risk: Orthostatic Hypotension",
        "Risk: QT Prolongation",
    ],
    "Neurological": [
        "Risk: CNS Depression",
        "Risk: Cognitive Impairment",
        "Risk: Extrapyramidal/Movement",
        "Risk: Headache/Migraine",
        "Risk: Seizure",
        "Risk: Vestibular/CNS",
    ],
    "Bleeding & GI Disorders": [
        "Risk: GI Bleeding",
        "Risk: Systemic Bleeding",
        "Risk: Bruising/Bleeding",
        "Risk: GI Toxicity",
        "Risk: Nausea/Vomiting",
    ],
    "Respiratory Disorders": [
        "Risk: Dyspnea/Bronchospasm",
        "Risk: Respiratory Depression",
        "Risk: Respiratory Infection",
    ],
    "Hepatic & Renal Disorders": [
        "Risk: Acute Renal Toxicity",
        "Risk: Hepatic Enzyme Stress",
        "Risk: Hepatotoxicity",
    ],
    "Metabolic & Endocrine": [
        "Risk: Electrolyte Imbalance",
        "Risk: Hyperglycemia",
        "Risk: Hypoglycemia",
    ],
    "Immune & Skin Disorders": [
        "Risk: Mild Dermatological",
        "Risk: Severe Anaphylaxis",
    ],
}


def classify_severity(prob: float, threshold: float) -> str:
    danger_margin = (prob - threshold) / (1.0 - threshold + 1e-8)

    if prob >= 0.75 or danger_margin > 0.60:
        return "high"
    if prob >= 0.50 or danger_margin > 0.30:
        return "moderate"
    return "low"


def summarize_results(categories: list[dict]) -> str:
    high_count = 0
    moderate_count = 0

    for category in categories:
        for finding in category["findings"]:
            if finding["severity"] == "high":
                high_count += 1
            elif finding["severity"] == "moderate":
                moderate_count += 1

    if high_count >= 2:
        return (
            "Elevated interaction burden detected and active monitoring is advised. "
            "Multiple high-risk categories were flagged."
        )
    if high_count == 1:
        return (
            "A meaningful high-risk signal was detected. "
            "Clinical review and monitoring may be warranted."
        )
    if moderate_count >= 2:
        return (
            "Moderate interaction burden detected across multiple categories. "
            "Consider closer review of the combined therapy."
        )
    if moderate_count == 1:
        return (
            "A moderate interaction signal was detected. "
            "Review the combination in clinical context."
        )
    return "No significant clinical risks were detected above learned thresholds."


def run_prediction(drugs: list[str]) -> dict:
    clean_drugs = [d.strip().lower() for d in drugs if d and d.strip()]
    joined_input = ", ".join(clean_drugs)

    x_input = tfidf.transform([joined_input]).astype(np.float32)
    x_tensor = torch.tensor(x_input.toarray(), dtype=torch.float32).to(device)

    with torch.no_grad():
        outputs = model(x_tensor)
        probs = torch.sigmoid(outputs).cpu().numpy()[0]

    categories = []
    all_flagged = []

    for parent_class, sub_risks in HIERARCHY_MAP.items():
        findings = []

        for i, risk in enumerate(PHENOTYPES):
            prob = float(probs[i])
            threshold = float(optimal_thresholds[i])

            if risk in sub_risks and prob > threshold:
                severity = classify_severity(prob, threshold)

                finding = {
                    "label": risk.replace("Risk: ", ""),
                    "severity": severity,
                    "probability": round(prob * 100, 1),
                    "rationale": (
                        "Flagged above learned phenotype threshold from the "
                        "FAERS-trained multi-label safety model."
                    ),
                }
                findings.append(finding)
                all_flagged.append(finding)

        if findings:
            findings = sorted(findings, key=lambda x: x["probability"], reverse=True)

            category_prob = max(f["probability"] for f in findings)
            category_severity = (
                "high"
                if any(f["severity"] == "high" for f in findings)
                else "moderate"
                if any(f["severity"] == "moderate" for f in findings)
                else "low"
            )

            categories.append(
                {
                    "name": parent_class,
                    "categoryRisk": round(category_prob, 1),
                    "severity": category_severity,
                    "findings": findings,
                }
            )

    categories = sorted(categories, key=lambda x: x["categoryRisk"], reverse=True)

    overall_score = round(max([c["categoryRisk"] for c in categories], default=0))
    high_risk_count = sum(1 for f in all_flagged if f["severity"] == "high")
    moderate_risk_count = sum(1 for f in all_flagged if f["severity"] == "moderate")

    return {
        "overallScore": overall_score,
        "summary": summarize_results(categories),
        "highRiskCount": high_risk_count,
        "moderateRiskCount": moderate_risk_count,
        "categories": categories,
    }