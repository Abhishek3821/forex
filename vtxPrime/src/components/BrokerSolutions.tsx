import SectionHeader from './SectionHeader';
import { assets, brokerSolutions } from '../data/siteData';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { navigationLinks } from '../data/navigationLinks';

export default function BrokerSolutions() {
  return (
    <>
      <section className="py-24">
        <div className="container-page">
          <SectionHeader
            align="left"
            eyebrow="Broker Solutions"
            title="Purpose-built for B2B and B2C trading businesses."
            copy="Whether you operate a retail brokerage, funded trader program, liquidity venue, or fintech product, VTX Prime gives you the operating foundation for client acquisition, trading, risk, liquidity, and reporting."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {brokerSolutions.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="glass-card rounded-xl p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/60 hover:bg-card-hover">
                <Icon className="h-8 w-8 text-primary-light" aria-hidden="true" />
                <h3 className="mt-5 font-display text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">{copy}</p>
                {navigationLinks[title] && <Link to={navigationLinks[title]} className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-primary-light hover:text-accent">Explore Solution <ArrowUpRight size={14} aria-hidden="true" /></Link>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-border bg-card/30 py-24">
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="container-page relative grid gap-10 lg:grid-cols-[.85fr_1fr] lg:items-center">
          <SectionHeader
            align="left"
            eyebrow="Multi-Asset Trading"
            title="One platform for global market access."
            copy="Deploy a multi asset trading platform that supports FX-first brokers while giving teams room to add CFDs, exchange-traded instruments, synthetic markets, and region-specific product sets."
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {assets.map((asset) => (
              <div key={asset} className="rounded-lg border border-border-light bg-surface/70 p-5 text-center transition hover:border-accent/60 hover:text-accent">
                <p className="font-display text-lg font-bold text-white">{asset}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
