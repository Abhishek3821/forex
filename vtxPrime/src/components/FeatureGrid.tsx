import { SignalGraphic, type GraphicKind } from './DesignGraphics';
import SectionHeader from './SectionHeader';
import { features, whyVtx } from '../data/siteData';

export default function FeatureGrid() {
  return (
    <>
      <section className="py-24" id="solutions">
        <div className="container-page">
          <SectionHeader
            eyebrow="Why VTX Prime"
            title="A trading platform software stack for teams that need control, speed, and scale."
            copy="VTX Prime gives brokers and fintech operators the tools to configure execution, manage risk, ship branded trading products, and connect institutional counterparties without stitching together disconnected systems."
          />
          <div className="home-feature-bento mt-12 grid gap-5 lg:grid-cols-3">
            {whyVtx.map(({ icon: Icon, title, copy }, index) => (
              <article key={title} className="glass-card rounded-xl p-7 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-card-hover/80 hover:shadow-glow">
                <Icon className="h-9 w-9 text-primary-light" aria-hidden="true" />
                <h3 className="mt-6 font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-4 leading-7 text-text-secondary">{copy}</p><SignalGraphic kind={(['network','market','security'] as GraphicKind[])[index % 3]} compact />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface/35 py-24">
        <div className="container-page">
          <SectionHeader
            eyebrow="Trading Platform Features"
            title="Everything modern traders expect, with the broker controls businesses require."
            copy="VTX Prime combines a fast trading terminal, advanced charts, multi-device access, copy trading, analytics, and APIs for a practical MetaTrader alternative or cTrader alternative."
          />
          <div className="home-product-grid mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="group rounded-xl border border-border bg-card/65 p-6 transition duration-300 hover:border-accent/60 hover:bg-card-hover hover:shadow-glow-cyan">
                <div className="grid h-12 w-12 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary-light transition group-hover:border-accent/70 group-hover:text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 leading-7 text-text-secondary">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
