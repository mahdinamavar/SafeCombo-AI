import { SectionHeading } from "@/components/ui/section-heading";

export function CTASection() {
  return (
    <section className="section-shell pb-6">
      <div className="glass-soft rounded-3xl px-6 py-8 text-center sm:px-10 sm:py-11">
        <SectionHeading
          label="Next Step"
          title="Ready to productize clinical AI intelligence?"
          description="SafeCombo AI is designed to evolve from mock inference into real-time model integration with production-grade observability and trust."
          centered
        />
        <a
          href="#demo"
          className="btn-primary mt-8 inline-flex px-7 py-3 text-sm"
        >
          Start Exploring Risk Signals
        </a>
      </div>
    </section>
  );
}
