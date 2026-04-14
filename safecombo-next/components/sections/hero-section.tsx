type HeroSectionProps = {
  stats: Array<{ label: string; value: string }>;
};

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="section-shell">
      <div className="hero-ambient glass-soft rounded-3xl px-6 py-10 sm:px-9 sm:py-14 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-brand-soft">
              Predictive Clinical Intelligence
            </p>
            <h1 className="headline-glow headline-contrast mt-4 max-w-3xl text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-6xl">
              Safer multi-drug decisions through{" "}
              <span className="text-gradient">interpretable AI risk signals</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              SafeCombo AI predicts adverse clinical phenotype risks for drug
              combinations, then transforms model output into clinician-friendly severity,
              confidence, and explainability views.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-xs text-white/70">
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                Dark Clinical UX
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                Explainable Outputs
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
                Recruiter-Ready Demo
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#demo" className="btn-primary hero-cta-primary px-6 py-3 text-sm">
                Try Interactive Demo
              </a>
              <a href="#methodology" className="btn-secondary px-6 py-3 text-sm">
                View Methodology
              </a>
            </div>
            <a
              href="#features"
              className="scroll-cue mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/65 hover:text-white/85"
            >
              <span className="scroll-cue-dot" />
              Scroll to explore
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map((stat) => (
              <article
                key={stat.label}
                className="glass rounded-2xl px-4 py-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:shadow-[0_14px_35px_rgba(82,110,255,0.22)]"
              >
                <p className="text-lg font-semibold text-white sm:text-xl">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
