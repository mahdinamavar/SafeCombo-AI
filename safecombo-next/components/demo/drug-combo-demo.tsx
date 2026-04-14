"use client";

import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { predictDrugCombo } from "@/lib/api";
import { ResultCard } from "@/components/ui/result-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { PredictionResponse, RiskSeverity } from "@/types/safecombo";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { cn } from "@/lib/utils";

const DRUG_SUGGESTIONS = [
  "Warfarin",
  "Ibuprofen",
  "Sertraline",
  "Tramadol",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Aspirin",
  "Omeprazole",
  "Amiodarone",
];

const LIVE_EXAMPLES: Array<{ label: string; drugs: string[] }> = [
  { label: "Warfarin + Ibuprofen", drugs: ["Warfarin", "Ibuprofen"] },
  { label: "Sertraline + Tramadol", drugs: ["Sertraline", "Tramadol"] },
  { label: "Metformin + Lisinopril + Aspirin", drugs: ["Metformin", "Lisinopril", "Aspirin"] },
];

const severityRank: Record<RiskSeverity, number> = {
  low: 1,
  moderate: 2,
  high: 3,
};

function severityFromScore(score: number): RiskSeverity {
  if (score >= 70) return "high";
  if (score >= 40) return "moderate";
  return "low";
}

export function DrugComboDemo() {
  const [draft, setDraft] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>(
    LIVE_EXAMPLES[0]?.drugs ?? ["Warfarin", "Ibuprofen"],
  );
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [analysisCompletedAt, setAnalysisCompletedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const activeRequestRef = useRef(0);

  const filteredSuggestions = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return DRUG_SUGGESTIONS.slice(0, 6);
    return DRUG_SUGGESTIONS.filter(
      (item) =>
        item.toLowerCase().includes(q) &&
        !selectedDrugs.some((d) => d.toLowerCase() === item.toLowerCase()),
    ).slice(0, 6);
  }, [draft, selectedDrugs]);

  const sortedCategories = useMemo(() => {
    if (!result) return [];
    return [...result.categories].sort((a, b) => {
      const severityDelta = severityRank[b.severity] - severityRank[a.severity];
      if (severityDelta !== 0) return severityDelta;
      return b.categoryRisk - a.categoryRisk;
    });
  }, [result]);

  const allResults = useMemo(
    () => result?.categories.flatMap((c) => c.findings) ?? [],
    [result],
  );

  const highRiskCategories = useMemo(
    () => sortedCategories.filter((category) => category.severity === "high"),
    [sortedCategories],
  );

  const highRiskSignals = useMemo(
    () => allResults.filter((item) => item.severity === "high").length,
    [allResults],
  );

  const moderateSignals = useMemo(
    () => allResults.filter((item) => item.severity === "moderate").length,
    [allResults],
  );

  const overallScore = result?.overallScore ?? 0;
  const overallSeverity = severityFromScore(overallScore);
  const aiSummary = result?.summary ?? "";

  const addDrug = (value: string) => {
    const cleaned = value.trim();
    if (!cleaned) return;
    if (selectedDrugs.some((item) => item.toLowerCase() === cleaned.toLowerCase())) return;
    setSelectedDrugs((prev) => [...prev, cleaned]);
    setDraft("");
  };

  const removeDrug = (value: string) => {
    setSelectedDrugs((prev) => prev.filter((item) => item !== value));
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addDrug(draft);
    }
    if (event.key === "Backspace" && !draft && selectedDrugs.length) {
      setSelectedDrugs((prev) => prev.slice(0, -1));
    }
  };

  const executePrediction = async (drugs: string[]) => {
    if (!drugs.length) return;

    const requestId = Date.now();
    activeRequestRef.current = requestId;
    setHasAnalyzed(true);
    setIsLoading(true);
    setErrorMessage(null);
    const start = Date.now();

    try {
      const response = await predictDrugCombo(drugs);
      const elapsed = Date.now() - start;
      const minLoadingMs = 650;
      if (elapsed < minLoadingMs) {
        await new Promise((resolve) => window.setTimeout(resolve, minLoadingMs - elapsed));
      }
      if (activeRequestRef.current !== requestId) return;
      setResult(response);
      setAnalysisCompletedAt(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    } catch (error) {
      if (activeRequestRef.current !== requestId) return;
      const fallback =
        "Prediction failed. Ensure backend is running on http://127.0.0.1:8000.";
      setErrorMessage(error instanceof Error ? error.message : fallback);
      setResult(null);
    } finally {
      if (activeRequestRef.current === requestId) {
        setIsLoading(false);
      }
    }
  };

  const runPrediction = () => {
    if (!selectedDrugs.length || isLoading) return;
    void executePrediction(selectedDrugs);
  };

  const runPredictionFor = (drugs: string[]) => {
    if (!drugs.length || isLoading) return;
    setSelectedDrugs(drugs);
    setDraft("");
    void executePrediction(drugs);
  };

  useEffect(() => {
    const defaultPreset = LIVE_EXAMPLES[0]?.drugs ?? [];
    const timerId = window.setTimeout(() => {
      void executePrediction(defaultPreset);
    }, 120);

    return () => window.clearTimeout(timerId);
  }, []);

  return (
    <section id="demo" className="section-shell relative scroll-mt-24">
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-b from-brand/15 via-transparent to-brand-soft/15" />
      <div className="glass-soft rounded-3xl p-5 sm:p-8 lg:p-10">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionHeading
              label="Interactive Product Demo"
              title="Drug Combination Risk Explorer"
              description="Add candidate therapies, run model prediction, and inspect structured risk insights."
            />
          </div>
        </div>

        <div className="glass mb-8 rounded-2xl border-brand-soft/25 bg-gradient-to-br from-indigo-950/70 to-slate-950/70 p-4 shadow-[0_24px_48px_rgba(34,60,140,0.28)] sm:p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-soft">Live Example</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {LIVE_EXAMPLES.map((example) => (
                <button
                  key={example.label}
                  type="button"
                  onClick={() => runPredictionFor(example.drugs)}
                  className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/90 transition hover:-translate-y-0.5 hover:border-brand-soft/60 hover:bg-white/[0.08]"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-soft">Input panel</p>
            <p className="text-xs text-white/60">Type a drug, press Enter or comma</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-slate-950/65 p-2">
            <div className="mb-2 flex flex-wrap gap-2">
              {selectedDrugs.map((drug) => (
                <button
                  key={drug}
                  type="button"
                  onClick={() => removeDrug(drug)}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-soft/35 bg-brand/15 px-3 py-1 text-xs font-semibold text-white transition hover:border-brand-soft/70 hover:bg-brand/25"
                >
                  {drug}
                  <span className="text-white/70">x</span>
                </button>
              ))}
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={
                  selectedDrugs.length
                    ? "Add another drug..."
                    : "Start with a drug name (e.g. Warfarin)"
                }
                className="min-w-[220px] flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 text-sm text-white outline-none placeholder:text-white/45 focus-visible:border-brand-soft/40 focus-visible:bg-white/[0.02]"
              />
            </div>
            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-2">
              {filteredSuggestions.length ? (
                filteredSuggestions.map((drug) => (
                  <button
                    key={drug}
                    type="button"
                    onClick={() => addDrug(drug)}
                    className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/85 transition hover:border-brand-soft/65 hover:bg-white/8"
                  >
                    + {drug}
                  </button>
                ))
              ) : (
                <p className="text-xs text-white/55">No matching suggestions.</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/60">
              Suggested combos: <span className="text-white/90">Warfarin + Ibuprofen</span>,{" "}
              <span className="text-white/90">Sertraline + Tramadol</span>
            </p>
            <button
              type="button"
              onClick={runPrediction}
              disabled={!selectedDrugs.length || isLoading}
              className={cn(
                "btn-primary px-6 py-3 text-sm",
                (!selectedDrugs.length || isLoading) && "cursor-not-allowed opacity-65",
              )}
            >
              {isLoading ? "Running prediction..." : "Run Prediction"}
            </button>
          </div>
        </div>

        {!hasAnalyzed ? (
          <div className="glass result-fade rounded-2xl p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-soft">Ready for analysis</p>
            <h4 className="mt-3 text-2xl font-semibold text-white">No prediction yet</h4>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted">
              Build a combination in the input panel, then run prediction to generate clinical
              category risks, severity markers, and explainability signals.
            </p>
          </div>
        ) : isLoading ? (
          <div className="result-fade grid gap-4">
            <div className="glass rounded-2xl p-6">
              <div className="ai-status mb-3 inline-flex items-center rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-[11px] tracking-[0.14em] text-white/75">
                <span>Analyzing interactions</span>
                <span className="ai-dots ml-1">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-soft">Analyzing</p>
              <h4 className="mt-2 text-lg font-semibold text-white">
                Computing interaction phenotype risk...
              </h4>
              <p className="mt-2 text-xs text-white/65">
                Parsing drug graph, scoring pathways, and synthesizing safety insight.
              </p>
              <p className="mt-2 text-xs text-white/52">
                System message: preparing clinical dashboard output...
              </p>
              <div className="loading-track mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="loading-bar h-full rounded-full bg-gradient-to-r from-brand to-brand-soft" />
              </div>
              <div className="mt-3 flex gap-2 text-[11px] uppercase tracking-[0.16em] text-white/55">
                <span className="loading-dot">ingest</span>
                <span className="loading-dot">infer</span>
                <span className="loading-dot">summarize</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="glass h-32 rounded-2xl animate-pulse" />
              <div className="glass h-32 rounded-2xl animate-pulse" />
            </div>
          </div>
        ) : errorMessage ? (
          <div className="glass result-fade rounded-2xl p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-rose-300">Prediction error</p>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
              {errorMessage}
            </p>
          </div>
        ) : result ? (
          <div className="result-fade rounded-3xl border border-brand-soft/30 bg-gradient-to-br from-slate-950/75 via-indigo-950/35 to-slate-950/85 p-4 shadow-[0_24px_52px_rgba(20,38,104,0.36)] sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-brand-soft">
                  Clinical intelligence dashboard
                </p>
                <h4 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                  Prediction Results
                </h4>
              </div>
              <div className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-white/80">
                {selectedDrugs.length} drug{selectedDrugs.length > 1 ? "s" : ""} analyzed
              </div>
            </div>
            {analysisCompletedAt ? (
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                <span>Analysis complete at {analysisCompletedAt}</span>
              </div>
            ) : null}

            <div className="mb-6 grid gap-3 sm:grid-cols-3">
              <article className="glass rounded-xl px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
                  Drugs analyzed
                </p>
                <p className="mt-1 text-xl font-semibold text-white">{selectedDrugs.length}</p>
              </article>
              <article className="glass rounded-xl px-4 py-3">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted">
                  <span className="h-2 w-2 rounded-full bg-rose-400/90" />
                  High-risk signals
                </p>
                <p className="mt-1 text-xl font-semibold text-rose-200">{result.highRiskCount || highRiskSignals}</p>
              </article>
              <article className="glass rounded-xl px-4 py-3">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted">
                  <span className="h-2 w-2 rounded-full bg-amber-300/90" />
                  Moderate signals
                </p>
                <p className="mt-1 text-xl font-semibold text-amber-100">{result.moderateRiskCount || moderateSignals}</p>
              </article>
            </div>

            <div className="space-y-8">
              <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
                <div className="glass rounded-2xl p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-soft">
                    Overall risk score
                  </p>
                  <div className="mt-3 flex items-end gap-3">
                  <p className="text-5xl font-semibold text-white">{result.overallScore}</p>
                    <p className="pb-2 text-xs text-white/60">/100</p>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <SeverityBadge severity={overallSeverity} />
                    <p className="text-sm text-white/75">
                      {highRiskCategories.length} high-risk categor
                      {highRiskCategories.length === 1 ? "y" : "ies"} flagged
                    </p>
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 sm:p-6">
                  <p className="mb-2 text-xs uppercase tracking-[0.22em] text-brand-soft">
                    AI-generated safety summary
                  </p>
                  <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                    {aiSummary}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    Context note: model-generated summary from backend inference.
                  </p>
                </div>
              </div>

              <div className="space-y-9">
                {sortedCategories.map((category, index) => {
                  const categorySeverity = category.severity;
                  const categoryRisk = category.categoryRisk;
                  const isHighRisk = categorySeverity === "high";

                  return (
                    <section
                      key={category.name}
                      style={{ animationDelay: `${index * 90}ms` }}
                      className={cn(
                        "category-reveal rounded-2xl border p-4 sm:p-5",
                        isHighRisk
                          ? "high-risk-appear border-rose-400/55 bg-rose-950/24 shadow-[0_0_30px_rgba(250,92,126,0.12)]"
                          : "border-white/12 bg-white/[0.02]",
                      )}
                    >
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{category.name}</h4>
                          <p className="text-xs uppercase tracking-[0.17em] text-muted">
                            {category.findings.length} finding{category.findings.length > 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-white/70">Category risk: {categoryRisk}%</p>
                          <SeverityBadge severity={categorySeverity} />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {category.findings.map((item) => (
                          <ResultCard
                            key={`${category.name}-${item.label}`}
                            result={item}
                            emphasize={item.severity === "high"}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass result-fade rounded-2xl p-8 text-center">
            <p className="text-sm text-white/75">
              Prediction is unavailable right now. Please retry the analysis.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
