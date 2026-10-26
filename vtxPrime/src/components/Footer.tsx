import { Linkedin, Mail, MapPin } from 'lucide-react';
import { footerLinks, type FooterLinks } from '../data/siteData';
import { vtxPrimeLogo } from '../assests';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-14" id="company">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr]">
          <div>
            {/* <a href="#" className="flex items-center gap-3" aria-label="VTX Prime home">
              <span className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/15 shadow-glow">
                <span className="font-display text-lg font-bold text-white">V</span>
              </span>
              <span className="font-display text-lg font-bold tracking-[0.2em] text-white">VTX PRIME</span>
            </a> */}
            <img
              src={vtxPrimeLogo}
              alt="VTX Prime"
              className="sm:h-20 h-auto w-auto object-contain mix-blend-lighten"
            />
            <p className="mt-5 max-w-sm leading-7 text-text-secondary">
              Institutional trading platform software for brokers, prop firms, liquidity providers, and global fintech teams.
            </p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-text-muted">
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-primary-light" /> sales@vtxprime.com</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-light" /> Global deployment and partner support</span>
              <span className="inline-flex items-center gap-2"><Linkedin className="h-4 w-4 text-primary-light" /> LinkedIn / VTX Prime</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {(Object.entries(footerLinks) as [keyof FooterLinks, string[]][]).map(([group, links]) => (
              <div key={group}>
                <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-silver">{group}</h2>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-text-muted transition hover:text-primary-light">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <p>© 2026 VTX Prime. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-primary-light">Privacy Policy</Link>
            <a href="#" className="hover:text-primary-light">Terms</a>
            <a href="#" className="hover:text-primary-light">Risk Disclosure</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
