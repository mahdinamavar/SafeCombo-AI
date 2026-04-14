import { SectionHeading } from "@/components/ui/section-heading";

export function MethodologySection({ steps }: { steps: string[] }) {
  return (
    <section id="methodology" className="section-shell">
      <div className="glass-soft rounded-3xl p-6 sm:p-9">
        <SectionHeading
          label="Methodology"
          title="Structured risk inference flow"
          description="A concise, transparent pipeline converts combination input into clinically grouped result intelligence."
        />
        <div className="mt-8 space-y-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="glass flex gap-4 rounded-2xl p-4 transition duration-300 hover:border-white/30 hover:bg-slate-900/65"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/25 text-sm font-semibold text-brand-soft">
                {index + 1}
              </span>
              <p className="text-sm leading-relaxed text-white/88 sm:text-base">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
