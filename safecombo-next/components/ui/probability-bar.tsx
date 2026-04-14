import { cn } from "@/lib/utils";

export function ProbabilityBar({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(value, 100));
  const colorClass =
    clamped >= 75
      ? "from-rose-500 to-orange-400"
      : clamped >= 45
        ? "from-amber-500 to-yellow-400"
        : "from-emerald-500 to-cyan-400";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs tracking-wide text-muted">
        <span>Probability</span>
        <span className="font-semibold text-white/90">{clamped}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full border border-white/10 bg-white/8">
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-700",
            colorClass,
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
