import { RiskSeverity } from "@/types/safecombo";
import { cn } from "@/lib/utils";

const styles: Record<RiskSeverity, string> = {
  low: "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30",
  moderate: "bg-amber-500/15 text-amber-300 border border-amber-400/30",
  high: "bg-rose-500/15 text-rose-300 border border-rose-400/40",
};

function labelForSeverity(severity: RiskSeverity): string {
  if (severity === "low") return "Low";
  if (severity === "moderate") return "Moderate";
  return "High";
}

export function SeverityBadge({ severity }: { severity: RiskSeverity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        styles[severity],
      )}
    >
      {labelForSeverity(severity)}
    </span>
  );
}
