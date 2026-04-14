export function Navbar() {
  return (
    <header className="sticky top-0 z-30 mb-12 pt-4">
      <div className="glass-soft mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-brand-soft">
            SAFECOMBO AI
          </p>
          <p className="mt-1 text-xs text-white/60">Clinical risk intelligence platform</p>
        </div>
        <nav className="hidden items-center gap-2 text-sm text-white/75 md:flex">
          <a className="rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white" href="#features">
            Features
          </a>
          <a className="rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white" href="#methodology">
            Methodology
          </a>
          <a className="rounded-lg px-3 py-2 transition hover:bg-white/8 hover:text-white" href="#demo">
            Demo
          </a>
        </nav>
        <a
          href="#demo"
          className="btn-primary px-4 py-2 text-xs sm:px-5 sm:text-sm"
        >
          Launch Demo
        </a>
      </div>
      <nav className="mt-3 flex items-center justify-center gap-2 text-xs text-white/80 md:hidden">
        <a className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/8" href="#features">Features</a>
        <a className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/8" href="#methodology">Methodology</a>
        <a className="rounded-full border border-white/15 px-3 py-1.5 transition hover:bg-white/8" href="#demo">Demo</a>
      </nav>
    </header>
  );
}
