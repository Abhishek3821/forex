import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Layers3 } from 'lucide-react';
import { ConnectionDiagram, OperationsPreview, PhonePreview, TradingTerminal } from '../components/TradingVisuals';
import { SolutionCTA, SolutionHeading, SolutionLink, useSolutionMetadata } from '../components/SolutionSections';
import { navigationGroups, navigationPages, type NavigationCategory, type NavigationPage } from '../data/navigationPages';
import './solutions.css';
import './navigation-pages.css';

const existingSolutions = [
  { name: 'Forex Brokers', path: '/solutions/forex-brokers', description: 'Trading platforms, client operations and a coordinated brokerage technology plan.' },
  { name: 'Prop Firms', path: '/solutions/prop-firms', description: 'Programme workflows, platform planning and a consistent trader experience.' },
  { name: 'Liquidity Providers', path: '/solutions/liquidity-providers', description: 'Metals, connectivity and the technology layers behind trading operations.' },
];

function TopicVisual({ page }: { page: NavigationPage }) {
  if (page.name === 'Mobile Trading') return <PhonePreview />;
  if (['Web Trading Platform', 'Desktop Platform', 'Advanced Charting', 'Execution Engine'].includes(page.name)) return <TradingTerminal />;
  if (['Copy Trading', 'Introducing Brokers', 'Asset Managers', 'Risk Management'].includes(page.name)) return <OperationsPreview />;
  return <ConnectionDiagram />;
}

export function NavigationDetailPage({ page }: { page: NavigationPage }) {
  useSolutionMetadata(page.name, page.description);
  const service = page.category === 'Solutions' ? page.name === 'White Label' ? 'White Label Solution' : 'CRM & Back Office' : page.category === 'Technology' ? 'API & Integrations' : 'Trading Platform';
  return <div className="solution-page navigation-detail-page"><section className="navigation-page-hero container-page"><nav className="navigation-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to={navigationGroups[page.category].path}>{page.category}</Link><span>/</span><span aria-current="page">{page.name}</span></nav><div className="solution-split"><div><p className="solution-eyebrow">{page.category.toUpperCase()} / {page.name.toUpperCase()}</p><h1>{page.title}</h1><p className="solution-body-copy">{page.description}</p><div className="solution-actions"><SolutionLink service={service}>Discuss {page.name}</SolutionLink><a href="#topic-scope" className="solution-text-link">Explore the Scope <ArrowRight size={15} /></a></div></div><div className={`navigation-topic-art ${page.name === 'Mobile Trading' ? 'navigation-mobile-art' : ''}`}><TopicVisual page={page} /></div></div></section><section id="topic-scope" className="container-page navigation-topic-scope"><SolutionHeading eyebrow="DEFINE THE DETAILS" title={`A practical scope for ${page.name.toLowerCase()}.`} /><div className="navigation-feature-grid">{page.features.map(([title, copy], i) => <article key={title}><span>0{i + 1} /</span><h3>{title}</h3><p>{copy}</p></article>)}</div><p className="navigation-scope-note">Final features, integration availability and delivery terms are agreed after a review of your requirements and vendor access.</p></section><section className="navigation-related container-page"><div><p className="solution-eyebrow">CONTINUE EXPLORING</p><h2>See the connected picture.</h2></div><Link to={navigationGroups[page.category].path}>All {page.category.toLowerCase()} <ArrowRight size={16} /></Link></section><SolutionCTA title="Let’s define your next step." copy="Tell us about your current environment, the workflows you want to improve and what a successful project would look like." service={service} /></div>;
}

export function NavigationCategoryPage({ category }: { category: NavigationCategory }) {
  const group = navigationGroups[category];
  useSolutionMetadata(category === 'Platform' ? 'Trading Platform Overview' : category, group.copy);
  const cards = [...(category === 'Solutions' ? existingSolutions : []), ...navigationPages.filter(page => page.category === category)];
  return <div className="solution-page navigation-category-page"><section className="navigation-category-hero container-page"><p className="solution-eyebrow">EXPLORE VTX PRIME / {category.toUpperCase()}</p><h1>{group.title}</h1><p>{group.copy}</p><SolutionLink service={category === 'Platform' ? 'Trading Platform' : category === 'Technology' ? 'API & Integrations' : 'Forex Brokerage Setup'}>Find the Right Fit</SolutionLink></section><section className="navigation-category-cards container-page"><div className="navigation-card-grid">{cards.map(card => <Link to={card.path} key={card.path}><div className="navigation-card-top"><span><Layers3 size={23} /></span><ArrowUpRight size={21} /></div><h2>{card.name}</h2><p>{card.description}</p><span className="navigation-card-action">Explore {card.name} <ArrowRight size={15} /></span></Link>)}</div></section><SolutionCTA title="Bring your requirements together." copy="Start with a conversation about your business, your existing tools and the technology you want to build." service={category === 'Technology' ? 'API & Integrations' : 'Trading Platform'} /></div>;
}
