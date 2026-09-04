import { ArrowUpRight, CandlestickChart, Cpu, Shield, TrendingUp } from 'lucide-react';
import Button from './Button';
import { metrics } from '../data/siteData';
import ImageCarousel from './ImageCarsouel';
import { bannerImage } from '../assests';
function DashboardVisual() {
  const bars = [42, 64, 38, 78, 56, 88, 52, 71, 45, 92, 67, 81];

  return (
    <div className="relative mx-auto mt-14 w-full max-w-5xl animate-float lg:mt-0">
      <div className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
      <div className="glass-card relative overflow-hidden rounded-xl">
        <div className="flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-danger" />
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="h-3 w-3 rounded-full bg-success" />
          </div>
          <p className="font-mono text-xs text-text-muted">VTX PRIME EXECUTION CORE</p>
        </div>
        <div className="grid gap-0 lg:grid-cols-[1.1fr_.9fr]">
          <div className="border-b border-border p-5 lg:border-b-0 lg:border-r">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-text-muted">EUR/USD</p>
                <p className="font-display text-3xl font-bold text-white">1.08472</p>
              </div>
              <div className="rounded-md border border-success/30 bg-success/10 px-3 py-2 font-mono text-sm font-semibold text-success">
                +0.42%
              </div>
            </div>
            <div className="relative h-64 rounded-lg border border-border bg-background/80 p-4">
              <div className="absolute inset-0 bg-grid-lines bg-[size:36px_36px] opacity-30" aria-hidden="true" />
              <svg className="relative h-full w-full" viewBox="0 0 520 220" role="img" aria-label="Trading platform price chart">
                <defs>
                  <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 162 C44 128 68 146 100 112 C132 78 152 92 186 70 C234 38 242 118 286 92 C332 64 340 44 382 78 C420 108 442 68 520 32 L520 220 L0 220 Z" fill="url(#lineFill)" />
                <path d="M0 162 C44 128 68 146 100 112 C132 78 152 92 186 70 C234 38 242 118 286 92 C332 64 340 44 382 78 C420 108 442 68 520 32" fill="none" stroke="#00D4FF" strokeWidth="4" strokeLinecap="round" />
                {bars.map((bar, index) => (
                  <rect key={bar + index} x={index * 43 + 8} y={220 - bar} width="12" height={bar} rx="3" fill={index % 3 === 0 ? '#0A84FF' : '#2A3648'} opacity="0.82" />
                ))}
              </svg>
            </div>
          </div>
          <div className="grid content-between gap-4 p-5">
            {[
              ['Bridge', 'LD4 -> NY4', '1.9ms'],
              ['FIX Session', 'LP-Aggregator-03', 'Active'],
              ['Risk Book', 'Net exposure', '$18.4M'],
              ['Orders', 'Processed today', '8.2M'],
            ].map(([label, name, value]) => (
              <div key={label} className="rounded-lg border border-border bg-card/80 p-4 transition hover:border-primary/50 hover:bg-card-hover">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs uppercase text-text-muted">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-silver">{name}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold text-primary-light">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function Hero() {
  return (
    <>
      <section id="platform" className="relative overflow-hidden pb-20 pt-32 sm:pt-36 lg:pb-28" >
        <div className="absolute inset-0 bg-grid-lines bg-[size:48px_48px] opacity-25" aria-hidden="true" />
        <div className="absolute inset-0 bg-radial-blue" aria-hidden="true" />
        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl animate-pulse-glow" aria-hidden="true" />

        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1fr_.92fr]">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary-light">
              <CandlestickChart className="h-4 w-4" aria-hidden="true" />
              Institutional multi asset trading platform
            </div>
            <h1 className="mt-7 max-w-5xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
              Institutional Trading Platform Built for <span className="gradient-text">Brokers, Prop Firms, and Financial Technology Businesses</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
              VTX Prime is premium trading platform software for businesses that need a modern forex trading platform,
              white label trading platform, broker platform, copy trading platform, liquidity bridge, FIX API, and
              risk management software in one secure operating layer.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button>Contact Sales</Button>
              <Button variant="secondary">Explore Platform</Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border border-border bg-surface/60 p-4 backdrop-blur">
                  <p className="font-mono text-2xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 text-xs leading-5 text-text-muted">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-text-secondary">
              {[
                [Shield, 'Security-first'],
                [Cpu, 'API-native'],
                [TrendingUp, 'Execution-focused'],
                [ArrowUpRight, 'Global deployment'],
              ].map(([Icon, label]) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2">
                  <Icon className="h-4 w-4 text-primary-light" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <DashboardVisual />
        </div>

      </section>
      <div className='py-8'>
        <ImageCarousel images={bannerImage} />
      </div>
    </>
  );
}
