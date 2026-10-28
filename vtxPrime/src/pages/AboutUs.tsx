import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Blocks, Code2, Globe2, Layers3, Monitor, Network, ShieldCheck, TrendingUp, Users, WalletCards } from 'lucide-react';
import { AboutArtwork } from '../components/AboutArtwork';
import './about.css';

const services = [
  { icon: Layers3, title: 'Brokerage Launch Planning', copy: 'Bring your platform, operating model and vendor dependencies into a coordinated launch plan.', className: 'about-service-launch', accent: 'blue' },
  { icon: Monitor, title: 'Trading Platform Setup', copy: 'Shape the trading experience, account configuration and integration scope around your business.', className: 'about-service-platform', accent: 'cyan' },
  { icon: Network, title: 'Liquidity & Payment Integration', copy: 'Map provider connections, pricing routes and payment workflows across your technology stack.', className: 'about-service-liquidity', accent: 'green' },
  { icon: Users, title: 'Client & IB Portal Configuration', copy: 'Define client journeys, partner dashboards, referral workflows and team permissions.', className: 'about-service-portal', accent: 'gold' },
  { icon: Globe2, title: 'Website & Brand Experience', copy: 'Create a clear digital presence that connects your brand, services and client onboarding.', className: 'about-service-web', accent: 'cyan' },
  { icon: TrendingUp, title: 'Growth & Operational Workflows', copy: 'Connect lead capture, client communication and reporting to support your next stage.', className: 'about-service-growth', accent: 'pink' },
];
const disciplines = ['Technical Architecture', 'Software Development', 'Risk & Access Controls', 'Platform Integrations', 'Brokerage Operations', 'Infrastructure & Reliability'];

export default function AboutUs() {
  useEffect(() => {
    const oldTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const oldDescription = meta?.getAttribute('content') || '';
    document.title = 'About Us | VTX Prime';
    meta?.setAttribute('content', 'Discover VTX Prime: connected trading technology, brokerage infrastructure and an integrated approach to platforms, operations and fintech delivery.');
    return () => { document.title = oldTitle; meta?.setAttribute('content', oldDescription); };
  }, []);

  return <div className="about-page">
    <section className="about-hero"><div className="container-page about-hero-grid">
      <div className="about-hero-copy"><p className="about-eyebrow"><span />ABOUT VTX PRIME</p><h1>Trading technology.<br /><span>A shared ambition.</span></h1><p className="about-lead">A connected foundation for the businesses shaping the future of trading.</p><p>VTX Prime brings trading platforms, brokerage operations and technology infrastructure into a clearer, more connected ecosystem. We focus on the systems behind the experience—from the first client interaction to account management, connectivity and reporting.</p><p>Whether you’re planning a new brokerage or refining an existing operation, start with technology shaped around the way your business works.</p><a href="#what-we-do" className="about-button">Explore Our Solutions <ArrowRight size={18} aria-hidden="true" /></a></div>
      <div className="about-hero-collage"><figure className="about-hero-tall"><AboutArtwork variant="technology" /><figcaption><span>CONNECTED BY DESIGN</span><strong>One vision.<br />Every connection.</strong></figcaption></figure><figure className="about-hero-small"><AboutArtwork variant="global" /></figure><figure className="about-hero-small"><AboutArtwork variant="collaboration" /></figure><span className="about-collage-tag"><span />VTX PRIME / TECHNOLOGY THAT CONNECTS</span></div>
    </div></section>

    <div className="container-page"><div className="about-principles">{[[Blocks, 'A connected ecosystem'], [Code2, 'Technology with purpose'], [ShieldCheck, 'Control at every layer']].map(([Icon, title]) => { const ItemIcon = Icon as typeof Blocks; return <div key={String(title)}><ItemIcon size={18} aria-hidden="true" /><span>{String(title)}</span></div>; })}</div></div>

    <section className="about-global"><div className="container-page about-split"><div className="about-global-art"><AboutArtwork variant="global" /><div className="about-art-label"><Globe2 size={18} /><span>Built for a connected world</span></div></div><div className="about-global-copy"><p className="about-eyebrow">ONE CONNECTED FOUNDATION</p><h2>A global market.<br />A more unified<br /><span>way to build.</span></h2><p>Trading businesses work across platforms, providers and operational teams. The technology connecting them should make those relationships easier to manage.</p><p>Our approach brings platform planning, CRM workflows, account tools and connectivity into one considered delivery scope. Each layer starts with a clear understanding of your business, available vendor access and operational responsibilities.</p><p className="about-highlight">The goal is simple: give your team a clearer path from ambitious ideas to practical implementation.</p></div></div></section>

    <section className="about-services" id="what-we-do"><div className="container-page"><div className="about-section-heading"><p className="about-eyebrow">WHAT WE DO</p><h2>The pieces you need.<br /><span>A more connected whole.</span></h2><p>Explore the technology and workflows behind a modern forex and digital-asset business.</p></div><div className="about-bento">
      {services.map(({ icon: Icon, title, copy, className, accent }) => <article key={title} className={`about-service-card ${className}`}><span className={`about-service-icon about-accent-${accent}`}><Icon size={21} aria-hidden="true" /></span><h3>{title}</h3><p>{copy}</p><Link to="/contact" aria-label={`Discuss ${title}`} className="about-card-link"><ArrowUpRight size={17} /></Link></article>)}
      <figure className="about-service-art about-service-compliance"><AboutArtwork variant="vision" /><figcaption><strong>A clearer launch path</strong><span>Planning & coordination</span></figcaption></figure>
      <article className="about-service-card about-service-crm"><div><span className="about-service-icon about-accent-violet"><Blocks size={21} aria-hidden="true" /></span><h3>CRM, Account Management & Copy Trading</h3><p>Scope the modules around your client lifecycle, allocation requirements and back-office workflows.</p></div><div className="about-module-list">{['MAM & PAMM workflows', 'Copy trading configuration', 'IB & affiliate management', 'Client onboarding'].map((item, i) => <div key={item}><span className="about-module-dot" /><span>{item}</span><span className="about-module-number">0{i + 1}</span></div>)}</div></article>
      <figure className="about-service-art about-service-payments"><div className="about-payment-art"><WalletCards size={64} strokeWidth={1.1} aria-hidden="true" /><span className="about-payment-orbit" /><ShieldCheck size={28} className="about-payment-shield" aria-hidden="true" /></div><figcaption><strong>Thoughtful connections</strong><span>Payments & infrastructure</span></figcaption></figure>
      <figure className="about-service-art about-service-team"><AboutArtwork variant="collaboration" /><figcaption><strong>Stronger, together</strong><span>Cross-functional thinking</span></figcaption></figure>
    </div><p className="about-scope-note">Every project is scoped around your requirements, platform access and provider relationships.</p></div></section>

    <section className="about-team"><div className="container-page about-team-grid"><div className="about-team-copy"><p className="about-eyebrow">PEOPLE. PURPOSE. PROGRESS.</p><h2>Different disciplines.<br /><span>One shared direction.</span></h2><p>Good trading technology needs more than a great interface. It needs architectural thinking, careful implementation and a clear view of the people who operate it.</p><p>These are the disciplines that shape a connected project—from the first requirements conversation to operational handover.</p><ul className="about-discipline-list">{disciplines.map(item => <li key={item}><span />{item}</li>)}</ul><div className="about-team-principle"><span className="about-quote-mark" aria-hidden="true">“</span><p>Clear ownership. Thoughtful engineering. A shared focus on the details that make the whole experience work.</p><span className="about-principle-caption">THE VTX PRIME APPROACH</span></div></div><div className="about-team-art"><div className="about-team-column"><AboutArtwork variant="collaboration" /><AboutArtwork variant="growth" /></div><div className="about-team-column"><AboutArtwork variant="vision" /><AboutArtwork variant="leadership" /></div></div></div></section>

    <section className="container-page about-final-cta"><div><p className="about-eyebrow">LET’S BUILD THE NEXT CHAPTER</p><h2>Your vision.<br /><span>Let’s connect the pieces.</span></h2></div><Link to="/contact" className="about-button">Talk to Our Team <ArrowRight size={18} aria-hidden="true" /></Link></section>
  </div>;
}
