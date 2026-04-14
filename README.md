# SafeCombo AI: Deep Learning for Pharmacovigilance & Drug Safety 💊🤖

SafeCombo AI is an end-to-end machine learning pipeline designed to predict severe adverse drug reactions (ADRs) caused by polypharmacy (drug-drug interactions). By mining the FDA's Adverse Event Reporting System (FAERS), this project cleans, standardizes, and models real-world clinical data to build a hierarchical safety dashboard for healthcare professionals.

## 🌟 Value Proposition & Key Features
Raw FDA data is notoriously noisy, filled with typos, varied dosages, and overlapping symptoms. This project transforms that chaos into a clinical decision-support tool through:

* **Deep NLP & Semantic Entity Resolution:** Uses `rapidfuzz` and the official FDA National Drug Code (NDC) database to standardize over 26,000 messy drug text entries into 15,000+ clean, generic pharmaceutical entities.
* **Clinical Phenotyping:** Maps thousands of vague, self-reported symptoms (e.g., "headache", "tiredness") into **21 hyper-specific clinical risks** (e.g., *GI Bleeding*, *CNS Depression*, *Acute Renal Toxicity*) based on MedDRA standards.
* **Surgical Data Purification:** Implements strict noise-reduction filters to eliminate fatal polypharmacy outliers (>6 drugs) and systemic failure "shotgun" reactions, improving the signal-to-noise ratio.
* **Robust Deep Learning Architecture:** A PyTorch neural network built to resist overfitting on sparse text data, utilizing heavy L2 regularization, dropout (50%), and weighted loss (`BCEWithLogitsLoss`) to accurately learn rare but fatal clinical events without hallucinating.
* **Dynamic Thresholding:** Automatically calculates the optimal classification threshold (F1-Score maximization) for each specific disease class, replacing naive 0.5 thresholds with statistically sound cutoffs.

## 🛠️ Technical Pipeline
1.  **Data Ingestion:** Automated bulk downloading of JSON records from the openFDA API.
2.  **Data Engineering:** PySpark/Pandas regex cleaning to strip dosages, formulations, and administrative noise.
3.  **Fuzzy Matching:** Resolution of brand names and typos against the FDA NDC standard.
4.  **Target Binarization:** Multi-label encoding of the 21 clinical phenotypes.
5.  **Vectorization:** TF-IDF transformation of the purified drug regimens.
6.  **Modeling & Inference:** PyTorch DNN training, followed by a hierarchical reporting engine.

## 📊 Example Inference Output
The model generates a clean, hierarchical clinical report. Example for `Warfarin + Ibuprofen + Aspirin`:

```text
🩺 Purified Safety Profile: WARFARIN + IBUPROFEN + ASPIRIN
=================================================================
🧠 Nervous System & Psych
----------------------------------------
  ↳ Risk: Vestibular/CNS           🟠 MOD | 56.1%  ███████████░░░░░░░░░

🩸 Bleeding & GI Disorders
----------------------------------------
  ↳ Risk: GI Bleeding              🔴 HIGH | 77.7%  ███████████████░░░░░
  ↳ Risk: Systemic Bleeding        🟡 LOW | 35.2%  ███████░░░░░░░░░░░░░
=================================================================