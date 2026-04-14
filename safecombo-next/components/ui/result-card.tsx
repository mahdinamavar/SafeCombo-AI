import { RiskFinding } from "@/types/safecombo";
import { ProbabilityBar } from "@/components/ui/probability-bar";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { cn } from "@/lib/utils";

export function ResultCard({
  result,
  emphasize,
}: {
  result: RiskFinding;
  emphasize?: boolean;
}) {
  return (
    <article
      className={cn(
        "glass group rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-slate-900/70",
        emphasize && "border-rose-400/40 bg-rose-950/20",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <h4 className="text-base font-semibold text-white transition group-hover:text-brand-soft">
          {result.label}
        </h4>
        <SeverityBadge severity={result.severity} />
      </div>
      <div className="mb-5 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Clinical rationale</p>
        <p className="text-sm leading-relaxed text-muted">{result.rationale}</p>
      </div>
      <ProbabilityBar value={result.probability} />
    </article>
  );
}
