import { trustedBy } from '../data/siteData';

export default function TrustedBy() {
  return (
    <section className="border-y border-border bg-surface/45 py-8" aria-labelledby="trusted-title">
      <div className="container-page">
        <h2 id="trusted-title" className="sr-only">Trusted by financial technology businesses</h2>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">Trusted infrastructure for</p>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-ticker gap-4">
              {[...trustedBy, ...trustedBy].map((item, index) => (
                <div key={`${item}-${index}`} className="min-w-44 rounded-md border border-border-light bg-card/60 px-5 py-3 text-center text-sm font-semibold text-silver">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
