import { HeroAtmosphere, HeroGraphics } from '../components/HeroGraphics';
import { VisualRibbon } from '../components/DesignGraphics';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeftRight, ArrowUpRight, BarChart3, Check, ChevronDown, Cloud, FileCheck2, Globe2, KeyRound, Layers3, LockKeyhole, Network, PieChart, Plug, Route, Server, ShieldCheck, SlidersHorizontal, Users, Zap } from 'lucide-react';
import { PriceChart, TradingTerminal } from '../components/TradingVisuals';
import { useSolutionMetadata } from '../components/SolutionSections';
import team from '../assests/forex/team-collaboration.png';
import infrastructure from '../assests/forex/security-infrastructure.png';
import './solutions.css';
import './asset-managers.css';

const capabilities = [
  { icon: Zap, label: 'Rapid Execution' }, { icon: Layers3, label: 'Multi-Asset Trading' },
  { icon: Route, label: 'Smart Order Routing' }, { icon: LockKeyhole, label: 'Automated Risk Controls' },
];
const features = [
  { icon: Server, title: 'White-Label Platform Deployment', copy: 'Build a branded trading environment with platform configuration, account workflows and multi-asset access shaped around your business.' },
  { icon: BarChart3, title: 'Liquidity & Pricing Integration', copy: 'Connect your selected liquidity sources with pricing and routing workflows designed for forex, cryptocurrency and CFD trading environments.' },
  { icon: Plug, title: 'API Trading Integration', copy: 'Bring CRM, client portals, risk tools, analytics, payment providers and liquidity connections together through supported platform interfaces.' },
];
const trust = [
  { icon: Zap, label: 'Execution workflows designed for demanding trading environments' },
  { icon: BarChart3, label: 'Real-time market data and liquidity routing integrations' },
  { icon: ArrowLeftRight, label: 'Connected forex and cryptocurrency trading experiences' },
  { icon: Plug, label: 'Integration with third-party systems and operational tools' },
  { icon: ShieldCheck, label: 'Risk controls, permissions and compliance review workflows' },
  { icon: Cloud, label: 'Scalable infrastructure and operational resilience planning' },
];
const benefits = [
  { icon: Zap, label: 'Performance-focused order execution' },
  { icon: Layers3, label: 'Multi-asset access: forex, crypto, CFDs, commodities and indices' },
  { icon: KeyRound, label: 'Secure, branded platform experiences' },
  { icon: PieChart, label: 'Reporting and portfolio analytics' },
  { icon: ArrowLeftRight, label: 'Smart routing and pricing workflows' },
  { icon: Globe2, label: 'Connected liquidity infrastructure' },
  { icon: Plug, label: 'Integration with your fintech systems' },
];
const views = [
  { id: 'allocation', label: 'Account allocation', icon: PieChart, title: 'A clear view across every account.', copy: 'Define account groups, allocation rules and manager access in one coordinated workspace. Keep the details behind each allocation visible to the people who need them.', points: ['Account grouping and eligibility', 'Configurable allocation workflows', 'Account-level reconciliation'], heading: 'ACCOUNT GROUPS', rows: [['Core FX', '8 accounts', 'Configured'], ['Multi-asset', '12 accounts', 'In review'], ['Managed group', '6 accounts', 'Configured']] },
  { id: 'risk', label: 'Risk oversight', icon: ShieldCheck, title: 'Keep oversight close to the action.', copy: 'Bring exposure views, review queues and permission boundaries together. Shape the controls around your mandates and the platforms you operate.', points: ['Group and account exposure views', 'Review and escalation procedures', 'Role-based control permissions'], heading: 'CONTROL WORKFLOWS', rows: [['Exposure review', 'Account groups', 'Enabled'], ['Access controls', 'Team roles', 'Configured'], ['Exceptions', 'Review queue', 'In review']] },
  { id: 'reporting', label: 'Client reporting', icon: FileCheck2, title: 'Make the details easier to understand.', copy: 'Connect reporting to the records behind it. Define the statements, account summaries and review steps your team and clients rely on.', points: ['Account activity summaries', 'Report access and export scope', 'Traceable source records'], heading: 'REPORTING WORKSPACE', rows: [['Account summary', 'Client view', 'Configured'], ['Activity records', 'Operations', 'Enabled'], ['Statements', 'Review queue', 'In review']] },
];
const roadmap = [
  { icon: Users, title: 'Understand your model', copy: 'Map manager roles, account structures, client mandates and your existing technology.' },
  { icon: Network, title: 'Connect the stack', copy: 'Agree the platform configuration, provider interfaces and allocation workflows.' },
  { icon: SlidersHorizontal, title: 'Validate the details', copy: 'Test permissions, reconciliation, reporting and representative exception scenarios.' },
  { icon: FileCheck2, title: 'Prepare for launch', copy: 'Complete acceptance checks, team handover and an agreed operational support plan.' },
];
const faqs = [
  ['Can we connect our existing trading platform?', 'We review the platform’s supported APIs, licensing and vendor access during discovery. The integration scope is then defined around the interfaces available to your project.'],
  ['Can the workspace support multiple account groups?', 'Account grouping, eligibility, manager permissions and allocation rules can be scoped around your operating model. Supported behaviour depends on the selected platform and its account capabilities.'],
  ['How are reporting and risk controls configured?', 'We start with the records, exposure views and review workflows your team needs, then define permissions, reporting fields and acceptance scenarios for the connected systems.'],
  ['Can we migrate from an existing setup?', 'Migration starts with a review of export formats, account mappings and destination interfaces. A staged rehearsal and reconciliation plan helps validate the data before an agreed cutover.'],
  ['What do we need to begin?', 'Share your platform, account model, current providers and the workflows you want to improve. We use those details to define a practical scope, dependencies and delivery plan.'],
];

function PortfolioWorkspace() {
  const [view, setView] = useState('allocation');
  const current = views.find(item => item.id === view)!;
  return <section className="am-section am-workspace" aria-labelledby="am-workspace-title"><div className="am-container"><div className="am-section-heading"><p className="am-eyebrow">DESIGNED FOR ASSET MANAGERS</p><h2 id="am-workspace-title">One workspace.<br /><span className="am-gradient">A more connected perspective.</span></h2><p>Connect the trading experience to the account operations behind it.</p></div><div className="am-workspace-shell"><div className="am-workspace-tabs" role="group" aria-label="Portfolio workspace views">{views.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={view === id} aria-controls="am-workspace-content" onClick={() => setView(id)}><Icon size={18} />{label}</button>)}</div><div className="am-workspace-content" id="am-workspace-content" aria-live="polite"><div><p className="am-eyebrow">YOUR OPERATIONS, CONNECTED</p><h3>{current.title}</h3><p>{current.copy}</p><ul>{current.points.map(point => <li key={point}><Check size={16} />{point}</li>)}</ul><Link className="am-text-link" to="/contact?service=Trading%20Platform">Explore your requirements <ArrowUpRight size={17} /></Link></div><div className="am-portfolio-preview"><div className="am-preview-top"><span><PieChart size={17} />VTX / MANAGER WORKSPACE</span><small>CONCEPT PREVIEW</small></div><div className="am-preview-chart"><div><span>CONNECTED OPERATIONS</span><strong>{current.heading}</strong></div><PriceChart alternate={view === 'risk'} compact /></div><div className="am-account-rows">{current.rows.map(([name, detail, status]) => <div key={name}><span><i /><strong>{name}</strong><small>{detail}</small></span><em className={status === 'In review' ? 'am-in-review' : ''}>{status}</em></div>)}</div><p className="am-preview-caption">Illustrative workspace · Not live account data</p></div></div></div></div></section>;
}

export default function AssetManagers() {
  useSolutionMetadata('Asset Manager Trading Technology', 'Explore VTX Prime trading platform technology for asset managers: multi-asset access, liquidity integrations, account allocation, risk oversight and reporting.');
  return <div className="am-page">
    <section className="am-hero hero-enhanced"><HeroAtmosphere /><div className="am-container am-hero-grid"><div><p className="am-eyebrow">VTX PRIME / ASSET MANAGERS</p><h1>Engineered Trading<br /> Solutions for<br /><span className="am-gradient">VTX Prime Platforms</span></h1><p className="am-hero-copy">Enterprise-grade technology to optimize, integrate, and enhance your trading ecosystem, built around the way you manage accounts and operate.</p><div className="am-hero-actions"><Link className="am-button" to="/contact?service=Trading%20Platform">Start Now <ArrowUpRight size={18} /></Link><a href="#am-overview"><ArrowDown size={15} /> Discover the platform</a></div></div><div className="am-laptop-stage"><span className="am-art-label">YOUR MARKETS. YOUR OPERATING MODEL.</span><div className="am-laptop"><div className="am-laptop-screen"><TradingTerminal /></div><div className="am-laptop-base"><span /></div></div><HeroGraphics primary="allocation" secondary="security" label="Clarity across your accounts" /><div className="am-art-bottom"><span><i /> CONNECTED BY DESIGN</span><span>VTX / TRADING TECHNOLOGY</span></div></div></div></section>

    <section className="am-section am-overview" id="am-overview"><div className="am-container am-split"><div><h2>Understanding VTX Prime Trading Technology and Why Brokers Choose It</h2><p>Bring rapid execution workflows, multi-asset trading and liquidity connectivity into a coordinated trading environment. Shape order routing, risk controls and integrations around your platform and business requirements.</p><div className="am-capability-pills">{capabilities.map(({ icon: Icon, label }) => <span key={label}><Icon size={21} />{label}</span>)}</div><p>Connect your trading platform with CRM, liquidity providers, payment processors, verification systems and operational tools. Build towards the speed, transparency and automation your brokerage and account managers need.</p></div><figure className="am-photo am-overview-photo"><img src={team} alt="Technology professionals collaborating on connected trading operations" loading="lazy" /><figcaption><Users size={19} /><span>Technology that brings your team together.</span></figcaption></figure></div></section>

    <section className="am-section am-core" aria-labelledby="am-core-title"><div className="am-container am-split"><figure className="am-photo am-infrastructure-photo"><img src={infrastructure} alt="Connected security and infrastructure systems" loading="lazy" /><figcaption><Network size={23} /><div><strong>Connected at every layer.</strong><span>PLATFORM / LIQUIDITY / OPERATIONS</span></div></figcaption></figure><div><h2 id="am-core-title">Core Features of Our Trading Technology Solutions</h2><div className="am-core-features">{features.map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={30} /><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div></div></div></section>

    <section className="am-section am-trust" aria-labelledby="am-trust-title"><div className="am-container am-split"><div><h2 className="am-lined-heading" id="am-trust-title">Why Brokers Trust VTX Prime Trading Technology</h2><ul className="am-trust-list">{trust.map(({ icon: Icon, label }) => <li key={label}><span className="am-icon-circle"><Icon size={21} /></span><span>{label}</span></li>)}</ul><p>Multi-asset capabilities and a connected trading architecture give new and established brokers a practical foundation for their next stage of growth.</p></div><div className="am-oversight-art"><div className="am-oversight-header"><span><ShieldCheck size={18} /> CONTROL & VISIBILITY</span><span>WORKSPACE PREVIEW</span></div><div className="am-oversight-title"><p>THE CONNECTED PICTURE</p><h3>Built for the details<br />that matter.</h3></div><div className="am-oversight-chart"><PriceChart /></div><div className="am-oversight-tiles">{[{ icon: Route, title: 'Smart routing', copy: 'Connected providers' }, { icon: ShieldCheck, title: 'Risk oversight', copy: 'Defined controls' }, { icon: BarChart3, title: 'Clear reporting', copy: 'Traceable records' }].map(({ icon: Icon, title, copy }) => <div key={title}><Icon size={22} /><strong>{title}</strong><small>{copy}</small></div>)}</div><p className="am-preview-caption">Illustrative platform capabilities</p></div></div></section>

    <section className="am-section am-benefits" aria-labelledby="am-benefits-title"><div className="am-container"><h2 className="am-lined-heading am-centered" id="am-benefits-title">Major Benefits for Brokers and Asset Managers</h2><ul className="am-benefit-grid">{benefits.map(({ icon: Icon, label }) => <li key={label}><span className="am-icon-circle"><Icon size={21} /></span><span>{label}</span></li>)}</ul><p className="am-benefit-note">A modern, scalable, multi-asset technology foundation designed around performance, operational reliability and a connected market experience.</p></div></section>

    <VisualRibbon kind="allocation" title="Every account. A clearer perspective." subtitle="Bring account groups, allocation workflows and operational visibility into one considered workspace." /><PortfolioWorkspace />

    <section className="am-section am-roadmap" aria-labelledby="am-roadmap-title"><div className="am-container"><div className="am-roadmap-heading"><div><p className="am-eyebrow">A PRACTICAL PATH FORWARD</p><h2 id="am-roadmap-title">From your requirements<br />to <span className="am-gradient">launch readiness.</span></h2></div><p>Connect each part of the project with a clear plan, defined dependencies and acceptance checks your team can follow.</p></div><ol className="am-roadmap-grid">{roadmap.map(({ icon: Icon, title, copy }, i) => <li key={title}><div className="am-roadmap-top"><span>0{i + 1}</span><Icon size={25} /></div><h3>{title}</h3><p>{copy}</p></li>)}</ol><div className="am-roadmap-note"><ShieldCheck size={21} /><p>Account mandates, permissions and operating responsibilities are mapped into the project from the start.</p></div></div></section>

    <section className="am-section am-faq" aria-labelledby="am-faq-title"><div className="am-container"><div className="am-faq-layout"><div><p className="am-eyebrow">BEFORE YOUR NEXT STEP</p><h2 id="am-faq-title">The details behind<br /><span className="am-gradient">a stronger setup.</span></h2><p>Start with the questions that shape your platform, your account workflows and your next stage of growth.</p><Link className="am-text-link" to="/contact?service=Trading%20Platform">Talk to our team <ArrowUpRight size={18} /></Link></div><div className="am-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}<ChevronDown size={19} /></summary><p>{answer}</p></details>)}</div></div><div className="am-final-cta"><div><p className="am-eyebrow">BUILD A MORE CONNECTED FOUNDATION</p><h3>Your strategy. Your accounts.<br />Technology that fits.</h3></div><Link className="am-button" to="/contact?service=Trading%20Platform">Discuss Your Project <ArrowUpRight size={20} /></Link></div></div></section>
  </div>;
}
