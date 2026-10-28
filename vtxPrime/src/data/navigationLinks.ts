import { navigationGroups, navigationPages } from './navigationPages';

export const navigationGroupLinks: Record<string, string> = {
  ...Object.fromEntries(Object.entries(navigationGroups).map(([name, group]) => [name, group.path])),
  Company: '/about-us',
};

export const navigationLinks: Record<string, string> = {
  ...Object.fromEntries(navigationPages.map(page => [page.name, page.path])),
  'Overview': '/platform',
  'About': '/about-us',
  'About Us': '/about-us',
  'Contact': '/contact',
  'Forex Brokers': '/solutions/forex-brokers',
  'Prop Firms': '/solutions/prop-firms',
  'Liquidity Providers': '/solutions/liquidity-providers',
};
