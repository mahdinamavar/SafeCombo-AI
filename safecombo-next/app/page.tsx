import { DrugComboDemo } from "@/components/demo/drug-combo-demo";
import { CTASection } from "@/components/sections/cta-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MethodologySection } from "@/components/sections/methodology-section";
import { Navbar } from "@/components/sections/navbar";
import { WhyMattersSection } from "@/components/sections/why-matters-section";
import { Reveal } from "@/components/ui/reveal";

export default function Home() {
  const features = [
    {
      title: "Clinical Category Grouping",
      description:
        "Model outputs are organized by organ-system categories to support rapid interpretation.",
    },
    {
      title: "Severity + Probability Layers",
      description:
        "Each adverse phenotype includes a calibrated severity label and confidence-style probability bar.",
    },
    {
      title: "Explainability Signals",
      description:
        "Transparent rationale snippets surface why each interaction signal appears elevated.",
    },
  ];

  const methodology = [
    "Normalize multi-drug inputs into standardized combination signatures.",
    "Score interaction phenotype likelihood using mock ensemble inference logic.",
    "Translate risk vectors into grouped clinical cards with actionable summaries.",
  ];

  const stats = [
    { label: "Mock Interaction Library", value: "1,200+" },
    { label: "Clinical Risk Categories", value: "14" },
    { label: "Explainability Signals", value: "Real-time" },
  ];

  const whyMatters = [
    {
      metric: "Polypharmacy Challenge",
      title: "Polypharmacy complexity grows faster than expected",
      description:
        "As medication count rises, interaction pathways multiply quickly, increasing cognitive load and review complexity.",
    },
    {
      metric: "Adverse Interaction Risk",
      title: "Hidden interactions can drive serious adverse events",
      description:
        "Overlapping mechanisms can elevate toxicity and instability risk, especially in high-acuity and multi-comorbidity cases.",
    },
    {
      metric: "Clinical Decision Support",
      title: "AI helps uncover hidden patterns for safer decisions",
      description:
        "AI can surface subtle multi-drug signals early, improving triage, prioritization, and confidence in clinical decision-making.",
    },
  ];

  return (
    <main className="grid-bg relative isolate overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <Navbar />
        <Reveal delayMs={20}>
          <HeroSection stats={stats} />
        </Reveal>
        <Reveal delayMs={40}>
          <FeaturesSection features={features} />
        </Reveal>
        <Reveal delayMs={60}>
          <MethodologySection steps={methodology} />
        </Reveal>
        <Reveal delayMs={80}>
          <WhyMattersSection items={whyMatters} />
        </Reveal>
        <Reveal delayMs={100}>
          <DrugComboDemo />
        </Reveal>
        <Reveal delayMs={120}>
          <CTASection />
        </Reveal>
      </div>
    </main>
  );
}
