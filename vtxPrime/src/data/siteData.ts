import {
  Activity,
  BarChart3,
  Blocks,
  Building2,
  Cloud,
  Code2,
  DatabaseZap,
  Gauge,
  Globe2,
  KeyRound,
  LineChart,
  LockKeyhole,
  Network,
  RadioTower,
  Repeat2,
  ShieldCheck,
  Smartphone,
  TerminalSquare,
  TrendingUp,
  Users,
  WalletCards,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  items?: string[];
}

export interface Metric {
  value: string;
  label: string;
}

export interface IconCard {
  icon: LucideIcon;
  title: string;
  copy: string;
}

export type AssetClass = string;

export type SecurityPoint = string;

export interface ComparisonItem {
  capability: string;
  vtx: boolean | string;
  legacy: boolean | string;
  generic: boolean | string;
}

export type FAQItem = [question: string, answer: string];

export interface FooterLinks {
  Platform: string[];
  Solutions: string[];
  Technology: string[];
  Resources: string[];
  Company: string[];
}
export const navItems: NavItem[] = [
  {
    label: 'Platform',
    items: ['Overview', 'Web Trading Platform', 'Desktop Platform', 'Mobile Trading', 'Copy Trading', 'Advanced Charting', 'Trading API'],
  },
  {
    label: 'Solutions',
    items: ['Forex Brokers', 'Prop Firms', 'Liquidity Providers', 'White Label', 'Introducing Brokers', 'Asset Managers'],
  },
  {
    label: 'Technology',
    items: ['Architecture', 'Execution Engine', 'Risk Management', 'FIX API', 'Bridge', 'Cloud Infrastructure', 'Security'],
  },
  // {
  //   label: 'Developers',
  //   items: ['REST API', 'WebSocket API', 'FIX API', 'SDKs', 'Documentation', 'Status'],
  // },
  // { label: 'Pricing' },
  {
    label: 'Resources',
    items: ['Blog', 'Knowledge Base', 'Documentation', 'Downloads', 'Release Notes', 'Case Studies', 'FAQ'],
  },
  {
    label: 'Company',
    items: ['About Us', 'Careers', 'Partners', 'Press', 'Contact'],
  },
];

export const trustedBy: string[] = ['Prime brokers', 'Forex brokers', 'Prop firms', 'Fintech startups', 'Liquidity venues', 'Asset managers'];

export const metrics: Metric[] = [
  { value: '2.8ms', label: 'median internal routing latency' },
  { value: '99.99%', label: 'target platform availability' },
  { value: '140+', label: 'markets and tradable instruments' },
  { value: '24/5', label: 'institutional support coverage' },
];

export const whyVtx: IconCard[] = [
  {
    icon: Gauge,
    title: 'Built for execution quality',
    copy: 'Route orders through a low-latency execution engine designed for forex trading platform operators, prop desks, and multi asset brokers.',
  },
  {
    icon: ShieldCheck,
    title: 'Broker-grade control',
    copy: 'Operate permissions, exposure, margin rules, symbols, fees, risk books, and liquidity routing from a secure broker platform back office.',
  },
  {
    icon: Blocks,
    title: 'Modular launch model',
    copy: 'Use VTX Prime as a white label trading platform, embedded trading API, liquidity bridge, or full MetaTrader alternative.',
  },
];

export const features: IconCard[] = [
  {
    icon: BarChart3,
    title: 'Advanced Charting',
    copy: 'Professional chart types, multi-timeframe analysis, drawing tools, indicators, depth views, watchlists, and precision order entry.',
  },
  {
    icon: Repeat2,
    title: 'Copy Trading Platform',
    copy: 'Create leaderboards, strategy profiles, allocation rules, performance disclosures, and risk caps for social and prop trading flows.',
  },
  {
    icon: Smartphone,
    title: 'Web, Desktop, Mobile',
    copy: 'Deliver a consistent trading experience across browser, desktop terminals, iOS, Android, and embedded partner portals.',
  },
  {
    icon: TerminalSquare,
    title: 'Trading API',
    copy: 'Expose REST API, WebSocket API, and SDK access for account operations, market data, order management, and reporting.',
  },
  {
    icon: Activity,
    title: 'Risk Management Software',
    copy: 'Monitor exposure, margin, leverage, alerts, position limits, markups, symbol groups, and dealing workflows in real time.',
  },
  {
    icon: LineChart,
    title: 'Market Analytics',
    copy: 'Give teams and traders actionable analytics for execution quality, spreads, liquidity, PnL, retention, and trading behavior.',
  },
];

export const brokerSolutions: IconCard[] = [
  {
    icon: Building2,
    title: 'Forex Brokers',
    copy: 'Launch a secure forex trading platform with multi-account management, client portals, liquidity connectivity, and configurable execution.',
  },
  {
    icon: Users,
    title: 'Prop Firms',
    copy: 'Run challenges, funded trader accounts, rules, violations, leaderboards, payouts, and trader analytics from one operating layer.',
  },
  {
    icon: Network,
    title: 'Liquidity Providers',
    copy: 'Distribute pricing, manage sessions, connect counterparties, and support professional FIX API and bridge integrations.',
  },
  {
    icon: WalletCards,
    title: 'White Label',
    copy: 'Deploy a branded white label trading platform with custom domains, themes, onboarding, trading groups, and regional configuration.',
  },
];
export const assets: string[] = ['FX', 'Metals', 'Indices', 'Commodities', 'Crypto CFDs', 'Equities', 'ETFs', 'Synthetic markets'];
export const technology: IconCard[] = [
  {
    icon: Cloud,
    title: 'Cloud Infrastructure',
    copy: 'Globally distributed services support regional deployment, observability, failover planning, and scalable market data delivery.',
  },
  {
    icon: Zap,
    title: 'Execution Engine',
    copy: 'Process orders, fills, swaps, commissions, liquidity routing, and trade lifecycle events through a deterministic execution core.',
  },
  {
    icon: DatabaseZap,
    title: 'Liquidity Bridge',
    copy: 'Connect LPs, aggregators, B-book/A-book flows, symbol mapping, markups, and routing rules through an institutional liquidity bridge.',
  },
  {
    icon: Code2,
    title: 'FIX API Connectivity',
    copy: 'Support professional counterparties with FIX API sessions for pricing, trading, drop copy, allocation, and institutional integrations.',
  },
];

export const security: string[] = [
  'Role-based access control for administrators, dealers, support teams, and partners',
  'Encryption in transit, hardened infrastructure, audit trails, and sensitive action logging',
  'Configurable KYC, AML, jurisdiction, leverage, and product availability controls',
  'Operational monitoring for uptime, failed logins, order anomalies, and service health',
];

export const comparison: ComparisonItem[] = [
  { capability: 'Modern web-first trading UX', vtx: true, legacy: false, generic: true },
  { capability: 'Native copy trading platform', vtx: true, legacy: 'Add-on', generic: false },
  { capability: 'REST, WebSocket, and FIX API', vtx: true, legacy: 'Limited', generic: 'Varies' },
  { capability: 'Broker risk management software', vtx: true, legacy: true, generic: false },
  { capability: 'Multi asset trading platform', vtx: true, legacy: 'Limited', generic: true },
  { capability: 'White label trading platform options', vtx: true, legacy: 'Costly', generic: 'Varies' },
];

export const faqs: FAQItem[] = [
  ['What is VTX Prime?', 'VTX Prime is institutional trading platform software for brokers, prop firms, fintech businesses, liquidity providers, and asset managers that need a scalable broker platform.'],
  ['Is VTX Prime a forex trading platform?', 'Yes. VTX Prime supports forex trading platform workflows while also supporting metals, indices, commodities, crypto CFDs, equities, and other multi asset markets.'],
  ['Can VTX Prime be used as a white label trading platform?', 'Yes. Brokers and fintech companies can deploy VTX Prime as a white label trading platform with custom branding, domains, account groups, and operational settings.'],
  ['Is VTX Prime a MetaTrader alternative?', 'VTX Prime is designed for teams evaluating a MetaTrader alternative with modern web, mobile, API, risk management, copy trading, and broker administration capabilities.'],
  ['Is VTX Prime a cTrader alternative?', 'Yes. VTX Prime can serve as a cTrader alternative for businesses that need flexible platform ownership, API access, liquidity bridge options, and custom broker workflows.'],
  ['Does VTX Prime support FIX API?', 'VTX Prime supports FIX API connectivity for institutional pricing, execution, drop copy, liquidity integrations, and professional counterparty workflows.'],
  ['Does the platform include a trading API?', 'Yes. VTX Prime includes trading API options such as REST API, WebSocket API, SDK access, and FIX API connectivity depending on the deployment model.'],
  ['Can prop firms use VTX Prime?', 'Yes. Prop firms can use VTX Prime for challenges, funded accounts, rule monitoring, copy trading, leaderboards, trader analytics, and payout workflows.'],
  ['Does VTX Prime include risk management software?', 'Yes. The platform includes risk management software for exposure, margin, leverage, order flow, symbols, account groups, alerts, and dealing oversight.'],
  ['What assets can brokers offer?', 'Brokers can configure FX, metals, indices, commodities, crypto CFDs, equities, ETFs, and other instruments through the multi asset trading platform architecture.'],
  ['Does VTX Prime include copy trading?', 'Yes. VTX Prime supports copy trading platform features including strategy profiles, allocation settings, performance data, risk controls, and investor discovery.'],
  ['Can VTX Prime connect to liquidity providers?', 'Yes. The platform supports liquidity provider connectivity through bridge infrastructure, routing rules, symbol mapping, pricing, markups, and FIX API sessions.'],
  ['Is VTX Prime suitable for startup brokers?', 'Yes. Startup brokers can begin with a white label trading platform model and expand into deeper API, risk, liquidity, and regional operating requirements over time.'],
  ['Is VTX Prime suitable for established brokers?', 'Yes. Established brokers can use VTX Prime to modernize client experience, add a MetaTrader alternative, improve API access, or consolidate trading infrastructure.'],
  ['Does VTX Prime support mobile trading?', 'Yes. VTX Prime is built for responsive web and mobile trading experiences with account access, charts, orders, positions, watchlists, and notifications.'],
  ['Can developers build on VTX Prime?', 'Yes. Developers can use documentation, REST API, WebSocket API, SDKs, and FIX API options to integrate onboarding, trading, reporting, and account services.'],
  ['How secure is VTX Prime?', 'VTX Prime uses a security-first operating model with encrypted communication, access controls, audit trails, monitoring, and configurable compliance controls.'],
  ['Does VTX Prime replace a liquidity bridge?', 'VTX Prime can include liquidity bridge capabilities for routing, pricing, counterparty connectivity, markups, and risk flow management.'],
  ['How fast can a broker launch?', 'Launch timelines depend on branding, integrations, compliance requirements, liquidity setup, and product scope, but the platform is structured for accelerated deployment.'],
  ['How do I get pricing?', 'Pricing depends on the deployment model, regions, modules, APIs, traffic, support level, and integrations. Contact sales for a scoped commercial proposal.'],
];

export const footerLinks: FooterLinks = {
  Platform: ['Overview', 'Web Platform', 'Desktop Platform', 'Mobile Trading', 'Copy Trading', 'Trading API'],
  Solutions: ['Forex Brokers', 'Prop Firms', 'Liquidity Providers', 'White Label', 'Introducing Brokers'],
  Technology: ['Execution Engine', 'FIX API', 'Liquidity Bridge', 'Cloud Infrastructure', 'Security'],
  Resources: ['Documentation', 'Blog', 'Knowledge Base', 'Release Notes', 'Case Studies'],
  Company: ['About', 'Careers', 'Partners', 'Press', 'Contact'],
};
type SecurityCard = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

const securityCards: SecurityCard[] = [
  {
    icon: LockKeyhole,
    title: "Encrypted Sessions",
    copy: "TLS-first communication and hardened service boundaries.",
  },
  {
    icon: KeyRound,
    title: "Access Governance",
    copy: "Granular roles for admin, dealing, support, IB, and partner teams.",
  },
  {
    icon: RadioTower,
    title: "Live Monitoring",
    copy: "Health checks, alerting, infrastructure logs, and service visibility.",
  },
  {
    icon: ShieldCheck,
    title: "Audit Trails",
    copy: "Sensitive action logs for platform, account, and order operations.",
  },
];
export interface HeroSlide {
  tag: "B2B" | "B2C";
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  cta: string;
  accent: "blue" | "purple" | "cyan";
  features: {
    icon: LucideIcon;
    title: string;
    copy: string;
  }[];
}

export const heroSlides: HeroSlide[] = [
  {
    tag: "B2B",
    eyebrow: "Building",
    title: "Trading Technology",
    highlight: "That Powers The Future",
    description:
      "Enterprise-grade trading infrastructure for brokers, prop firms, liquidity providers, and fintech businesses.",
    cta: "Explore Platform",
    accent: "blue",
    features: [
      { icon: Zap, title: "High Performance", copy: "Low Latency" },
      { icon: ShieldCheck, title: "Secure", copy: "Reliable" },
      { icon: BarChart3, title: "Scalable", copy: "By Design" },
      { icon: Code2, title: "API Ready", copy: "Built for Innovation" },
    ],
  },
  {
    tag: "B2B",
    eyebrow: "All-in-one",
    title: "Broker Platform",
    highlight: "Launch. Operate. Grow.",
    description:
      "White label trading platform with risk engine, liquidity bridge, CRM, and back-office tools.",
    cta: "Contact Sales",
    accent: "purple",
    features: [
      { icon: Globe2, title: "White Label", copy: "Custom Brand" },
      { icon: ShieldCheck, title: "Risk Engine", copy: "Real-time Control" },
      { icon: Code2, title: "FIX API", copy: "Liquidity Bridge" },
      { icon: Users, title: "CRM", copy: "Back Office" },
    ],
  },
  {
    tag: "B2C",
    eyebrow: "Trade Smarter",
    title: "Anytime, Anywhere",
    highlight: "Built For Traders",
    description:
      "A modern trading experience with charts, fast execution, copy trading, alerts, and mobile access.",
    cta: "Start Trading",
    accent: "cyan",
    features: [
      { icon: BarChart3, title: "Advanced Charts", copy: "Pro Tools" },
      { icon: Zap, title: "Fast Orders", copy: "Execution" },
      { icon: Users, title: "Copy Trading", copy: "Follow Pros" },
      { icon: ShieldCheck, title: "Secure Funds", copy: "Protection" },
    ],
  },
];