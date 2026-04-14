type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionHeading({
  label,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "text-center" : ""}>
      <p className="text-xs uppercase tracking-[0.24em] text-brand-soft">{label}</p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={
            centered
              ? "mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base"
              : "mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
