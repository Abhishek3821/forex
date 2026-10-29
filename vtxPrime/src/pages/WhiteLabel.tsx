import { HeroAtmosphere, HeroGraphics } from '../components/HeroGraphics';
import { VisualRibbon } from '../components/DesignGraphics';
import { Activity, BarChart3, BriefcaseBusiness, Cpu, DollarSign, Globe2, Layers3, LifeBuoy, MonitorSmartphone, Package, PenTool, Rocket, Server, Settings, ShieldCheck, Wifi, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TradingTerminal } from '../components/TradingVisuals';
import { useSolutionMetadata } from '../components/SolutionSections';
import workspace from '../assests/forex/trading-workspace.png';
import team from '../assests/forex/team-collaboration.png';
import connectivity from '../assests/forex/security-infrastructure.png';
import './white-label.css';

const features = [
  { title: 'White Label Technology Provider', copy: 'Launch your brokerage with a fully branded cTrader experience, tailored to your business.', image: team, alt: 'Technology team reviewing a brokerage dashboard' },
  { title: 'Multi-Asset Trading Technology', copy: 'Bring forex, CFDs, commodities, indices and cryptocurrencies together in one trading environment.', image: workspace, alt: 'Multi-screen trading workspace with market charts' },
  { title: 'Hosting, Bridging & Connectivity Solutions', copy: 'Connect your platform with hosting and bridging designed for dependable market access.', image: connectivity, alt: 'Connected technology infrastructure' },
];
const advantages = [
  { title: 'Rapid White Label Deployment', copy: 'Get your brokerage ready to launch with a fully branded platform and a coordinated deployment plan.', image: workspace, icon: Rocket },
  { title: 'Multi-Asset Support', copy: 'Offer forex, CFD and cryptocurrency trading experiences from a single platform.', image: team, icon: Layers3 },
  { title: 'Reliable Execution & Connectivity', copy: 'Support smooth trade execution with low-latency hosting, bridging and connected infrastructure.', image: connectivity, icon: Wifi },
];
const extras = [
  { icon: Layers3, label: 'Multi-asset features' }, { icon: Cpu, label: 'API & bridge integration' },
  { icon: PenTool, label: 'White label customization' }, { icon: Activity, label: 'Sophisticated charting' },
  { icon: BarChart3, label: 'Enhanced analytics' }, { icon: BriefcaseBusiness, label: 'CRM integration' },
];
const services = [
  { icon: MonitorSmartphone, label: 'White label technology and platform customization' },
  { icon: Globe2, label: 'Multi-asset trading infrastructure and connectivity' },
  { icon: Server, label: 'Hosting, bridging, and API integration' },
  { icon: Package, label: 'Turnkey solutions for forex, CFD, and cryptocurrency brokers' },
  { icon: LifeBuoy, label: 'Ongoing deployment support and analytics platforms' },
];

function StabilityVisual() {
  return <figure className="wl-stability" aria-label="Illustration of trading volume stability and connected infrastructure">
    <div className="wl-chart-label"><span>VOLUME STABILITY</span><span>HIGH LOAD</span></div>
    <div className="wl-volume-chart" aria-hidden="true"><div className="wl-bars">{[28, 43, 34, 57, 48, 72, 62, 85, 77, 91, 83, 96].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><svg viewBox="0 0 400 160" preserveAspectRatio="none"><path d="M0 135 C45 115 60 70 110 48 S220 18 275 14 S350 10 400 3" /></svg></div>
    <div className="wl-system-tiles"><div><ShieldCheck /><strong>Secure</strong></div><div><Globe2 /><strong>Connected</strong></div></div>
    <figcaption><span>SYS_STATUS</span><strong><i /> FUTURE-READY</strong></figcaption>
  </figure>;
}

export default function WhiteLabel() {
  useSolutionMetadata('cTrader White Label Solutions', 'Explore VTX Prime cTrader white label technology, multi-asset trading, hosting, API integrations and brokerage deployment support.');
  return <div className="wl-page">
    <section className="wl-hero hero-enhanced" aria-labelledby="wl-title"><HeroAtmosphere />
      <div className="wl-coins" aria-hidden="true"><span className="wl-coin-sol">≋</span><span className="wl-coin-eth">◆</span><span className="wl-coin-btc">₿</span><span className="wl-coin-bnb">❖</span><span className="wl-coin-usdt">₮</span></div>
      <div className="wl-hero-shade" />
      <div className="wl-container wl-hero-content"><p className="wl-eyebrow">VTX PRIME / WHITE LABEL SOLUTIONS</p><h1 id="wl-title">High-Performance cTrader<br className="wl-desktop-break" /> Technology Solutions for Brokers</h1><p>Deliver institutional trading experiences with robust cTrader server setups, API integrations, and IT support.</p><div className="wl-actions"><Link className="wl-button" to="/contact?service=White%20Label%20Solution">Start Now</Link><Link className="wl-button wl-button-secondary" to="/contact?service=White%20Label%20Solution&subject=cTrader%20Demo">View Demo</Link></div><HeroGraphics primary="layers" secondary="security" label="Your brand. Every layer." /></div>
    </section>

    <section className="wl-container wl-overview" aria-labelledby="wl-overview-title"><div className="wl-overview-art"><TradingTerminal /></div><div><h2 id="wl-overview-title">Understanding <em>cTrader</em> and How It Enhances Broker Operations</h2><p>cTrader is a multi-asset trading platform that allows trading in forex, CFDs, and other financial markets and features user-friendly interfaces, speedy trade execution, and sophisticated charting instruments.</p><p>cTrader technology-powered brokers can access an ecosystem that includes white label arrangements, platform customization, API integration, and hosting solutions.</p><blockquote>At VTX Prime, we assist brokers in integrating and setting up the cTrader platform, customizing the software to match business requirements, and providing reliable connectivity for smooth trading.</blockquote><p>Our offerings support both aspiring brokerages and established businesses, helping them build a high-performance trading experience with efficient operations.</p><div className="wl-badges">{[{ icon: Globe2, label: 'Multi-Asset' }, { icon: Zap, label: 'Speedy Execution' }, { icon: Settings, label: 'Customization' }, { icon: DollarSign, label: 'Low Ops Cost' }].map(({ icon: Icon, label }) => <span key={label}><Icon size={16} />{label}</span>)}</div></div></section>

    <section className="wl-container wl-section" aria-labelledby="wl-features-title"><h2 className="wl-heading" id="wl-features-title">Key Features of VTX Prime’s <em>cTrader Technology Solutions</em></h2><div className="wl-feature-grid">{features.map(item => <article className="wl-feature-card" key={item.title}><img src={item.image} alt={item.alt} loading="lazy" /><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>

    <VisualRibbon kind="layers" title="Your brand. Every layer connected." subtitle="From the trader workspace to the services behind it, build a platform that feels like your own." /><section className="wl-container wl-section wl-advantages" aria-labelledby="wl-advantages-title"><h2 className="wl-heading" id="wl-advantages-title">Key Advantages of <em>cTrader Solutions</em> for Brokers</h2><div className="wl-feature-grid">{advantages.map(({ title, copy, image, icon: Icon }) => <article className="wl-advantage-card" key={title}><div className="wl-advantage-image"><img src={image} alt="" loading="lazy" /><span><Icon size={29} /></span></div><div className="wl-advantage-copy"><h3>{title}</h3><p>{copy}</p></div></article>)}</div></section>

    <section className="wl-lower" aria-labelledby="wl-additional-title"><div className="wl-container wl-additional"><div><h2 id="wl-additional-title">Additional Features That Make <em>cTrader</em> Stand Out</h2><p>With cTrader technology, brokers can enjoy a range of multi-asset features, API & bridge integration, white label customization, sophisticated charting, and enhanced analytics capabilities. Clients can access quick and dependable execution while brokers integrate with CRM, back-office, and reporting systems.</p><p>We support the deployment and operation of trading platforms with capacity planning and monitoring designed to help maintain stability during high trading volumes, giving brokers confidence and clients a consistent trading experience.</p><div className="wl-badges wl-extra-badges">{extras.map(({ icon: Icon, label }) => <span key={label}><Icon size={18} />{label}</span>)}</div><div className="wl-callout"><span><Globe2 size={27} /></span><p>VTX Prime brings scalable, secure, and globally connected brokerage solutions together to help make your business future-ready.</p></div></div><StabilityVisual /></div></section>

    <section className="wl-lower wl-conclusion" aria-labelledby="wl-conclusion-title"><div className="wl-container"><h2 id="wl-conclusion-title">Build a High-Performance Brokerage<br /> with <em>cTrader</em></h2><p className="wl-conclusion-intro">Brokers working with VTX Prime can bring together a full range of cTrader technology services, which include:</p><div className="wl-services">{services.map(({ icon: Icon, label }) => <article key={label}><span><Icon size={23} /></span><h3>{label}</h3></article>)}</div><blockquote className="wl-closing-quote">“Build with VTX Prime for the technology, connectivity, and performance your brokerage needs to deliver exceptional trading experiences and grow worldwide.”</blockquote></div></section>
  </div>;
}
