import { SectionHeading } from "@/components/ui/section-heading";

type WhyMattersItem = {
  title: string;
  description: string;
  metric: string;
};

export function WhyMattersSection({ items }: { items: WhyMattersItem[] }) {
  return (
    <section className="section-shell">
      <div className="glass-soft rounded-3xl p-6 sm:p-9">
        <SectionHeading
          label="Why This Matters"
          title="Polypharmacy risk is complex, costly, and often hidden"
          description="Adverse interaction signals can be difficult to spot manually. SafeCombo AI helps teams surface hidden risk patterns earlier with clearer decision support."
        />
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.title}
              className="glass group rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:shadow-[0_15px_34px_rgba(63,103,255,0.2)]"
            >
              <p className="text-sm font-semibold tracking-wide text-brand-soft">{item.metric}</p>
              <h3 className="mt-3 text-lg font-semibold text-white transition group-hover:text-brand-soft">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
