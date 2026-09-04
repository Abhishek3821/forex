import { CheckCircle2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { technology } from '../data/siteData';

export default function Technology() {
  return (
    <section className="py-24" id="technology">
      <div className="container-page">
        <SectionHeader
          eyebrow="Technology Infrastructure"
          title="Execution, APIs, bridge, and cloud infrastructure engineered for financial operations."
          copy="VTX Prime is designed as a platform layer for trading businesses that need reliable connectivity, observability, customization, and operational control across regions and counterparties."
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {technology.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="rounded-xl border border-border bg-surface/70 p-6 transition duration-300 hover:border-primary/60 hover:bg-card-hover">
              <Icon className="h-9 w-9 text-accent" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-bold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/10 p-6 shadow-glow">
          <div className="grid gap-5 md:grid-cols-3">
            {['Horizontal services architecture', 'Real-time market data distribution', 'Dealer, admin, and developer workspaces'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-silver">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
