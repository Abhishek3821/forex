import { ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './Button';
import { navItems } from '../data/siteData';
import { vtxLogo } from '../assests';
import { Link } from 'react-router-dom';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/82 backdrop-blur-2xl">
      <nav className="container-page flex h-20 items-center justify-between" aria-label="Primary navigation">
        <Link to="/" className="group flex items-center gap-3" aria-label="VTX Prime home" onClick={() => setOpen(false)}>
          {/* <span className="grid h-10 w-10 place-items-center rounded-md border border-primary/40 bg-primary/15 shadow-glow">
            <span className="font-display text-lg font-bold text-white">V</span>
          </span> */}
          <img src={vtxLogo} alt="" className="grid h-16 w-auto place-items-center rounded-md " />
          <span className="font-display text-lg font-bold tracking-[0.2em] text-white">VTX PRIME</span>
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="group relative">
              <a
                href={`#${item.label.toLowerCase()}`}
                className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-text-secondary transition hover:bg-card/70 hover:text-white"
              >
                {item.label}
                {item.items ? <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" aria-hidden="true" /> : null}
              </a>
              {item.items ? (
                <div className="invisible absolute left-0 top-full w-64 translate-y-3 rounded-lg border border-border-light bg-surface/95 p-2 opacity-0 shadow-2xl shadow-black/40 backdrop-blur-xl transition duration-200 group-hover:visible group-hover:translate-y-2 group-hover:opacity-100">
                  {item.items.map((dropdownItem) => (
                    <a
                      key={dropdownItem}
                      href="#platform"
                      className="block rounded-md px-3 py-2.5 text-sm text-text-secondary transition hover:bg-card-hover hover:text-white"
                    >
                      {dropdownItem}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button variant="secondary" icon={false} className="min-h-10 px-4 py-2">Contact Sales</Button>
          <Button icon={false} className="min-h-10 px-4 py-2">Get Started</Button>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border-light bg-card/80 text-white lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {
        open ? (
          <div className="border-t border-border bg-background/98 px-4 pb-6 pt-3 lg:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <details key={item.label} className="rounded-md border border-border bg-surface/60">
                  <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-white">{item.label}</summary>
                  {item.items ? (
                    <div className="grid gap-1 border-t border-border px-2 py-2">
                      {item.items.map((dropdownItem) => (
                        <a key={dropdownItem} href="#platform" className="rounded-md px-3 py-2 text-sm text-text-secondary">
                          {dropdownItem}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </details>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="secondary" icon={false}>Contact Sales</Button>
              <Button icon={false}>Get Started</Button>
            </div>
          </div>
        ) : null
      }
    </header >
  );
}
