import { useEffect, type ReactNode } from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function useSolutionMetadata(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute('content') || '';
    document.title = `${title} | VTX Prime`;
    meta?.setAttribute('content', description);
    return () => { document.title = previousTitle; meta?.setAttribute('content', previousDescription); };
  }, [title, description]);
}

export function SolutionLink({ children = 'Discuss Your Project', service = 'Forex Brokerage Setup', secondary = false }: { children?: ReactNode; service?: string; secondary?: boolean }) {
  return <Link to={`/contact?service=${encodeURIComponent(service)}`} className={`solution-button ${secondary ? 'solution-button-secondary' : ''}`}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>;
}

export function SolutionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: ReactNode; copy?: string; light?: boolean }) {
  return <div className={`solution-heading ${light ? 'heading-on-light' : ''}`}><p className="solution-eyebrow">{eyebrow}</p><h2>{title}</h2>{copy && <p className="solution-heading-copy">{copy}</p>}</div>;
}

export function SolutionChecklist({ items }: { items: string[] }) {
  return <ul className="solution-checklist">{items.map(item => <li key={item}><Check size={16} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

export function SolutionFAQ({ items }: { items: [string, string][] }) {
  return <section className="solution-faq container-page"><SolutionHeading eyebrow="A little more clarity" title="Before we build, let’s answer a few questions." /><div className="solution-faq-list">{items.map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}</div></section>;
}

export function SolutionCTA({ title, copy, service }: { title: string; copy: string; service: string }) {
  return <section className="solution-final-cta container-page"><div><p className="solution-eyebrow">THE NEXT STEP STARTS HERE</p><h2>{title}</h2><p>{copy}</p><SolutionLink service={service}>Let’s Build Together</SolutionLink></div><span className="solution-cta-decoration" aria-hidden="true">↗</span></section>;
}
