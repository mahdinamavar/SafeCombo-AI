type Feature = {
  title: string;
  description: string;
};

import { SectionHeading } from "@/components/ui/section-heading";

export function FeaturesSection({ features }: { features: Feature[] }) {
  return (
    <section id="features" className="section-shell">
      <SectionHeading
        label="Core Features"
        title="Purpose-built for clinical readability"
        description="Every view is tuned for fast comprehension of interaction risk and confidence signals."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="glass-soft group mt-6 rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-[0_16px_38px_rgba(70,122,255,0.2)]"
          >
            <h3 className="mb-3 text-lg font-semibold text-white transition group-hover:text-brand-soft">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
