import { ArrowUpRight, Check, Network, ShieldCheck } from 'lucide-react';
import { SignalGraphic, type GraphicKind } from './DesignGraphics';
import './hero-graphics.css';

export function HeroGraphics({ primary = 'network', secondary = 'security', label = 'Connected by design' }: { primary?: GraphicKind; secondary?: GraphicKind; label?: string }) {
  return <div className={`hero-graphics hero-graphics-${primary}`} aria-label="Platform concept illustrations">
    <div className="hero-graphic-primary"><SignalGraphic kind={primary} compact /><div className="hero-graphic-caption"><Network size={13} /><span>{label}</span><ArrowUpRight size={13} /></div></div>
    <div className="hero-graphic-secondary"><SignalGraphic kind={secondary} compact /><div className="hero-graphic-status"><ShieldCheck size={13} /><span>BUILT AROUND YOU</span><Check size={12} /></div></div>
  </div>;
}

export function HeroAtmosphere() {
  return null;
}
