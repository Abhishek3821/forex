import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navItems } from '../data/siteData';
import { navigationGroupLinks, navigationLinks } from '../data/navigationLinks';
import { vtxLogo } from '../assests';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const location = useLocation();

  function closeMenus() { setOpen(false); setDropdown(null); setMobileGroup(null); }

  useEffect(() => { closeMenus(); }, [location.pathname, location.search]);
  useEffect(() => {
    function outsideClick(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) closeMenus();
    }
    function escape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      const activeLabel = Object.keys(triggerRefs.current).find(label => triggerRefs.current[label]?.getAttribute('aria-expanded') === 'true');
      if (activeLabel) triggerRefs.current[activeLabel]?.focus();
      closeMenus();
    }
    document.addEventListener('pointerdown', outsideClick);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outsideClick); document.removeEventListener('keydown', escape); };
  }, []);

  return <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 isolate border-b border-border bg-background">
    <nav className="container-page flex h-20 items-center justify-between gap-4" aria-label="Primary navigation">
      <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="VTX Prime home" onClick={closeMenus}>
        <img src={vtxLogo} alt="" className="h-12 w-auto rounded-md sm:h-16" />
        <span className="whitespace-nowrap font-display text-base font-bold tracking-[0.2em] text-white sm:text-lg">VTX PRIME</span>
      </Link>

      <div className="hidden items-center gap-2 xl:flex">
        {navItems.map(item => <div
          key={item.label}
          className="relative"
          onPointerEnter={event => { if (event.pointerType === 'mouse') setDropdown(item.label); }}
          onPointerLeave={event => { if (event.pointerType === 'mouse') setDropdown(current => current === item.label ? null : current); }}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setDropdown(current => current === item.label ? null : current); }}
        >
          <div className={`flex items-center rounded-md transition hover:bg-card ${dropdown === item.label ? 'bg-card' : ''}`}>
            <NavLink to={navigationGroupLinks[item.label]} onClick={closeMenus} className={({ isActive }) => `whitespace-nowrap rounded-l-md py-2 pl-3 pr-1 text-sm font-semibold transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-light ${isActive ? 'text-primary-light' : 'text-text-secondary'}`}>
              {item.label}
            </NavLink>
            <button
              type="button"
              ref={element => { triggerRefs.current[item.label] = element; }}
              aria-label={`${dropdown === item.label ? 'Close' : 'Open'} ${item.label} menu`}
              aria-expanded={dropdown === item.label}
              aria-controls={dropdown === item.label ? `desktop-nav-${item.label}` : undefined}
              onClick={() => setDropdown(current => current === item.label ? null : item.label)}
              className="grid h-10 w-8 place-items-center rounded-r-md text-text-secondary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-light"
            ><ChevronDown className={`h-3.5 w-3.5 transition ${dropdown === item.label ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
          </div>
          {dropdown === item.label && <div id={`desktop-nav-${item.label}`} className="absolute left-0 top-full z-10 w-64 pt-2">
            <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-lg border border-border-light bg-surface p-2 shadow-2xl shadow-black/50">
              {item.items?.map(label => <NavLink
                key={label}
                to={navigationLinks[label]}
                end
                onClick={closeMenus}
                className={({ isActive }) => `block rounded-md px-3 py-2.5 text-sm transition hover:bg-card-hover hover:text-white focus-visible:bg-card-hover focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-light ${isActive ? 'bg-card-hover text-primary-light' : 'text-text-secondary'}`}
              >{label === 'Contact' ? 'Contact Us' : label}</NavLink>)}
            </div>
          </div>}
        </div>)}
      </div>

      <div className="hidden shrink-0 items-center gap-3 xl:flex">
        <Link to="/contact" onClick={closeMenus} className="inline-flex min-h-11 items-center justify-center rounded-md border border-border-light bg-surface px-4 py-2 text-sm font-bold text-silver transition hover:border-primary hover:bg-card-hover">Contact Sales</Link>
        <Link to="/contact" onClick={closeMenus} className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-hover">Get Started</Link>
      </div>

      <button type="button" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border-light bg-card text-white xl:hidden" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls={open ? 'mobile-navigation' : undefined} onClick={() => setOpen(value => !value)}>
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </nav>

    {open && <nav id="mobile-navigation" aria-label="Mobile navigation" className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border bg-background px-4 pb-6 pt-3 xl:hidden">
      <div className="space-y-2">{navItems.map(item => <div key={item.label} className="rounded-md border border-border bg-surface">
        <div className="flex items-center">
          <Link to={navigationGroupLinks[item.label]} onClick={closeMenus} className="flex-1 px-4 py-3 text-sm font-semibold text-white">{item.label}</Link>
          <button type="button" onClick={() => setMobileGroup(current => current === item.label ? null : item.label)} aria-expanded={mobileGroup === item.label} aria-controls={mobileGroup === item.label ? `mobile-nav-${item.label}` : undefined} aria-label={`${mobileGroup === item.label ? 'Close' : 'Open'} ${item.label} submenu`} className="grid h-12 w-12 shrink-0 place-items-center rounded-r-md text-text-secondary hover:bg-card-hover hover:text-white"><ChevronDown className={`h-4 w-4 transition ${mobileGroup === item.label ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
        </div>
        {mobileGroup === item.label && <div id={`mobile-nav-${item.label}`} className="grid gap-1 border-t border-border p-2">{item.items?.map(label => <NavLink key={label} to={navigationLinks[label]} end onClick={closeMenus} className={({ isActive }) => `rounded-md px-3 py-2.5 text-sm hover:bg-card-hover hover:text-white ${isActive ? 'bg-card-hover text-primary-light' : 'text-text-secondary'}`}>{label === 'Contact' ? 'Contact Us' : label}</NavLink>)}</div>}
      </div>)}</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/contact" onClick={closeMenus} className="rounded-md border border-border-light bg-surface px-4 py-3 text-center text-sm font-bold text-silver">Contact Sales</Link>
        <Link to="/contact" onClick={closeMenus} className="rounded-md bg-primary px-4 py-3 text-center text-sm font-bold text-white">Get Started</Link>
      </div>
    </nav>}
  </header>;
}
