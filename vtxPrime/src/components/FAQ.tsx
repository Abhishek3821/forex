import SectionHeader from './SectionHeader';
import { faqs } from '../data/siteData';

export default function FAQ() {
  return (
    <section className="border-y border-border bg-surface/35 py-24" id="resources">
      <div className="container-page">
        <SectionHeader
          eyebrow="FAQ"
          title="Trading platform software questions answered."
          copy="Use these answers to evaluate VTX Prime for brokerage launches, prop firm operations, white label deployments, API programs, liquidity connectivity, and platform migration projects."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-border bg-card/70 p-5 transition hover:border-primary/50 hover:bg-card-hover">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-white">
                <h3 className="text-base sm:text-lg">{question}</h3>
                <span className="material-symbols-outlined text-primary-light transition group-open:rotate-45" aria-hidden="true">
                  add
                </span>
              </summary>
              <p className="mt-4 leading-7 text-text-secondary">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
