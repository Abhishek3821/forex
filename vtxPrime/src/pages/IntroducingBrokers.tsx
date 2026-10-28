import { VisualRibbon } from '../components/DesignGraphics';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight, BarChart3, Check, GitBranch, Globe2, Layers3, Link2, Network, Plug, Radar, Server, ShieldCheck, Users, Zap } from 'lucide-react';
import { PriceChart } from '../components/TradingVisuals';
import { useSolutionMetadata } from '../components/SolutionSections';
import workspace from '../assests/forex/trading-workspace.png';
import './solutions.css';
import './introducing-brokers.css';

const benefits = [
  { icon: Zap, title: 'Seamless Liquidity Provider Integration', copy: 'Connect your trading environment with multiple liquidity providers across forex and cryptocurrency markets through a coordinated integration.' },
  { icon: BarChart3, title: 'High-Performance Trading', copy: 'Support execution quality with real-time pricing updates, considered routing and visibility into your liquidity connections.' },
  { icon: Server, title: 'Scalable and Flexible Technology', copy: 'Build a technology foundation that can evolve with your brokerage, growing trading volumes and additional asset classes.' },
];
const solutions = [
  { icon: GitBranch, title: 'Liquidity Bridge & Aggregation Solutions', copy: 'Combine multiple liquidity sources into a connected pricing environment, with aggregation and routing configured around your operating requirements.' },
  { icon: Network, title: 'Broker Liquidity Solutions', copy: 'A coordinated technology scope for brokers looking to integrate institutional-grade liquidity into their trading platforms.' },
  { icon: Plug, title: 'Liquidity Provider API Integration Service', copy: 'Connect trading systems with external liquidity providers through supported APIs, including authentication, event handling and monitoring.' },
];
const strengths = [
  { icon: Layers3, title: 'Multiple liquidity sources connected with low-latency architecture' },
  { icon: BarChart3, title: 'Real-time pricing and market-depth visibility' },
  { icon: ShieldCheck, title: 'Broker risk and exposure management through connected tools' },
  { icon: Zap, title: 'Systems designed to grow with institutional trading volumes' },
];
const steps = [
  { title: 'Discover your requirements', copy: 'Map your target markets, partner model, trading platform and liquidity-provider requirements.' },
  { title: 'Design the connections', copy: 'Agree provider interfaces, referral workflows, account permissions and reporting requirements.' },
  { title: 'Test the complete journey', copy: 'Validate onboarding, referral attribution, pricing flows and operational exception scenarios.' },
  { title: 'Launch with a clear handover', copy: 'Bring your team up to speed with deployment documentation and an agreed support plan.' },
];
const toolkit = [
  { id: 'referrals', label: 'Referral journeys', icon: Link2, title: 'Every relationship starts with a clear connection.', copy: 'Shape the journey from the first partner referral to client onboarding. Keep attribution, registration and approval steps connected.', points: ['Branded partner entry points', 'Referral attribution workflows', 'Client onboarding visibility'], rows: ['Partner referral', 'Registration & verification', 'Account onboarding'], states: ['Attributed', 'In review', 'Ready'] },
  { id: 'reporting', label: 'Partner reporting', icon: BarChart3, title: 'Give your partners a clearer view.', copy: 'Define a partner workspace that brings together referred accounts, activity summaries and commission records in one understandable view.', points: ['Account and activity summaries', 'Commission review workflows', 'Role-based report access'], rows: ['Referred accounts', 'Activity summaries', 'Commission records'], states: ['Connected', 'Available', 'Review'] },
  { id: 'support', label: 'Operational support', icon: ShieldCheck, title: 'Build confidence behind the scenes.', copy: 'Connect the people and processes that support your introducing broker network, with clear ownership of reviews, access and technical enquiries.', points: ['Partner access and permissions', 'Review and escalation workflows', 'Deployment and integration support'], rows: ['Partner permissions', 'Support requests', 'Integration monitoring'], states: ['Scoped', 'Assigned', 'Enabled'] },
];

function LiquidityArtwork() {
  return <figure className="ib-market-art" aria-label="Illustration of connected liquidity sources and a market chart">
    <div className="ib-art-top"><span><i /> CONNECTED MARKETS</span><Globe2 size={18} /></div>
    <div className="ib-market-route"><span>FOREX</span><span>CFDs</span><span>CRYPTO</span></div>
    <div className="ib-market-chart"><PriceChart /></div>
    <div className="ib-source-line"><div><Layers3 /><span>Liquidity sources</span></div><span className="ib-route-dots" aria-hidden="true" /><div className="ib-aggregate-node"><GitBranch /><span>Aggregation</span></div><span className="ib-route-dots" aria-hidden="true" /><div><Network /><span>Your platform</span></div></div>
    <figcaption>One connected technology foundation <span>ILLUSTRATIVE ARCHITECTURE</span></figcaption>
  </figure>;
}

function PartnerToolkit() {
  const [selected, setSelected] = useState('referrals');
  const active = toolkit.find(item => item.id === selected)!;
  return <section className="ib-section ib-toolkit" aria-labelledby="ib-toolkit-title"><div className="ib-container"><div className="ib-section-intro"><p className="ib-eyebrow">BUILT AROUND YOUR PARTNER NETWORK</p><h2 id="ib-toolkit-title">More connections.<br /><span className="ib-gradient">A clearer partner experience.</span></h2><p>Bring introducing broker relationships and the technology behind them into one coordinated workflow.</p></div>
    <div className="ib-toolkit-shell"><div className="ib-toolkit-options" role="group" aria-label="Explore partner capabilities">{toolkit.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={selected === id} aria-controls="ib-toolkit-panel" onClick={() => setSelected(id)}><Icon size={19} /><span>{label}</span><ArrowUpRight size={17} /></button>)}</div><div id="ib-toolkit-panel" className="ib-toolkit-panel" aria-live="polite"><div><span className="ib-mini-label">PARTNER OPERATIONS / {active.label.toUpperCase()}</span><h3>{active.title}</h3><p>{active.copy}</p><ul>{active.points.map(point => <li key={point}><Check size={15} />{point}</li>)}</ul></div><div className="ib-workflow-preview"><div className="ib-preview-heading"><Users size={19} /><span>PARTNER WORKSPACE</span><span className="ib-preview-demo">CONCEPT</span></div>{active.rows.map((row, i) => <div key={row} className="ib-preview-row"><span>0{i + 1}</span><strong>{row}</strong><small>{active.states[i]}</small></div>)}<p>Designed around your operating model.</p></div></div></div>
  </div></section>;
}

export default function IntroducingBrokers() {
  useSolutionMetadata('Introducing Brokers & Liquidity Technology', 'Explore VTX Prime liquidity connectivity, bridge and API integrations, and technology for introducing broker partner networks.');
  return <div className="ib-page">
    <section className="ib-hero"><div className="ib-container ib-hero-grid"><div><p className="ib-eyebrow">VTX PRIME / INTRODUCING BROKERS</p><h1><span className="ib-gradient">Institutional-Grade Liquidity</span><br />Technology for Financial Brokers</h1><p className="ib-hero-copy">Connect to deep liquidity pools with robust bridge systems and aggregation technology designed for low-latency execution.</p><Link className="ib-outline-button" to="/contact?service=Liquidity%20Connectivity">Get Started <ArrowUpRight size={22} /></Link><a className="ib-explore" href="#ib-overview"><ArrowDown size={15} /> Explore the technology</a></div><figure className="ib-hero-image"><img src={workspace} alt="Professional multi-screen trading workspace showing financial market charts" fetchPriority="high" /><figcaption><span><i /> CONNECT. AGGREGATE. GROW.</span><strong>Your network.<br />A stronger foundation.</strong></figcaption><span className="ib-image-corner"><Radar size={17} /> VTX / CONNECTIVITY</span></figure></div></section>

    <section id="ib-overview" className="ib-section ib-overview"><div className="ib-container ib-two-column"><div><h2>What Is a Liquidity Provider and How We Help Brokers Succeed</h2><p>A liquidity provider supplies market pricing and depth that brokers use to support trade execution. The quality of those connections helps shape pricing, available liquidity and the trading experience across forex and cryptocurrency markets.</p><p>At VTX Prime, we help brokers connect their technology to institutional liquidity sources, manage multiple provider connections, and coordinate execution infrastructure. Our scope can include forex and crypto connectivity, API integration, bridge configuration and deployment support, creating a foundation that can grow with your business.</p><Link className="ib-solid-button" to="/contact?service=Liquidity%20Connectivity">Get Started <ArrowUpRight size={17} /></Link></div><LiquidityArtwork /></div></section>

    <section className="ib-section ib-benefits" aria-labelledby="ib-benefits-title"><div className="ib-container"><h2 className="ib-centered-title" id="ib-benefits-title">Key Benefits of VTX Prime’s<br /> Liquidity Provider Solutions</h2><div className="ib-benefit-grid">{benefits.map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={35} /><h3>{title}</h3><p>{copy}</p></article>)}</div><p className="ib-section-note">A connected foundation helps brokers improve client experiences, explore new markets, and maintain a trading environment that evolves with their business.</p></div></section>

    <section className="ib-section ib-solutions" aria-labelledby="ib-solutions-title"><div className="ib-container ib-two-column"><div className="ib-solutions-intro"><span className="ib-vertical-accent" aria-hidden="true" /><h2 id="ib-solutions-title">Comprehensive Liquidity Provider Technology Solutions</h2><p>Bring the moving parts of liquidity connectivity together. VTX Prime helps brokers define and implement the technology required by a modern trading environment.</p><Link className="ib-text-link" to="/contact?service=API%20%26%20Integrations">Discuss your integration <ArrowUpRight size={18} /></Link></div><div className="ib-solution-list">{solutions.map(({ icon: Icon, title, copy }, i) => <article key={title}><span className="ib-card-number" aria-hidden="true">0{i + 1}</span><Icon size={29} /><h3>{title}</h3><p>{copy}</p></article>)}</div></div></section>

    <section className="ib-section ib-why" aria-labelledby="ib-why-title"><div className="ib-container"><div className="ib-two-column"><div><p className="ib-eyebrow">THE TECHNOLOGY BEHIND EVERY CONNECTION</p><h2 id="ib-why-title">Why Choose VTX Prime for Liquidity Provider Integration</h2><p>Connecting multiple providers brings challenges: latency, inconsistent pricing, fragmented workflows and technical complexity. We bring integration planning, platform configuration and operational visibility together around your requirements.</p></div><div className="ib-strength-grid">{strengths.map(({ icon: Icon, title }) => <article key={title}><Icon size={20} /><h3>{title}</h3></article>)}</div></div><p className="ib-section-note">Build towards secure, reliable and coordinated liquidity connections, with clearer execution workflows, exposure visibility and a more consistent client experience.</p></div></section>

    <VisualRibbon kind="globe" title="More relationships. A wider perspective." subtitle="Connect partner journeys, account information and the market infrastructure behind your network." /><PartnerToolkit />

    <section className="ib-section ib-launch" aria-labelledby="ib-launch-title"><div className="ib-container"><div className="ib-launch-heading"><div><p className="ib-eyebrow">FROM FIRST CONVERSATION TO LAUNCH</p><h2 id="ib-launch-title">A clear route to<br /><span className="ib-gradient">your next connection.</span></h2></div><p>Move forward with a practical plan, agreed dependencies, and a team that understands how your partners and platforms fit together.</p></div><ol className="ib-launch-steps">{steps.map(({ title, copy }, i) => <li key={title}><span className="ib-step-marker">0{i + 1}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol><div className="ib-final-cta"><div><p className="ib-eyebrow">LET’S BUILD YOUR NEXT CHAPTER</p><h3>Connect your technology.<br />Grow your partner network.</h3></div><Link className="ib-outline-button" to="/contact?service=Partnership">Discuss Your Project <ArrowUpRight size={22} /></Link></div></div></section>
  </div>;
}
