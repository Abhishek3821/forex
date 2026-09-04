import { KeyRound, LockKeyhole, RadioTower, ShieldCheck } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { security } from '../data/siteData';

const securityCards = [
  [LockKeyhole, 'Encrypted Sessions', 'TLS-first communication and hardened service boundaries.'],
  [KeyRound, 'Access Governance', 'Granular roles for admin, dealing, support, IB, and partner teams.'],
  [RadioTower, 'Live Monitoring', 'Health checks, alerting, infrastructure logs, and service visibility.'],
  [ShieldCheck, 'Audit Trails', 'Sensitive action logs for platform, account, and order operations.'],
] as const;

export const Security: React.FC = () => {
  return (
    <section className="border-y border-border bg-surface/40 py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Security and Compliance"
            title="Secure controls for regulated, high-volume trading environments."
            copy="Financial businesses need more than a polished terminal. VTX Prime supports security governance, operational monitoring, access control, and compliance workflows that help teams protect clients and infrastructure."
          />
          <div className="mt-8 grid gap-4">
            {security.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-border bg-card/70 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
                <p className="text-sm leading-6 text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
          <div className="glass-card relative rounded-xl p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {securityCards.map(([Icon, title, copy]) => (
                <article key={title} className="rounded-lg border border-border bg-background/70 p-5">
                  <Icon className="h-7 w-7 text-primary-light" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-text-muted">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
