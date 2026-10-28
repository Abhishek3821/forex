import type { RouteObject } from 'react-router-dom';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import FeatureGrid from './components/FeatureGrid';
import BrokerSolutions from './components/BrokerSolutions';
import Technology from './components/Technology';
import Comparison from './components/Comparison';
import FAQ from './components/FAQ';
import { Security } from './components/Security';
import Layout from './components/Layout';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import ForexBrokers from './pages/ForexBrokers';
import PropFirms from './pages/PropFirms';
import LiquidityProviders from './pages/LiquidityProviders';
import WhiteLabel from './pages/WhiteLabel';
import IntroducingBrokers from './pages/IntroducingBrokers';
import AssetManagers from './pages/AssetManagers';
import PlatformOverview from './pages/PlatformOverview';
import WebTradingPlatform from './pages/WebTradingPlatform';
import { navigationPages, type NavigationCategory } from './data/navigationPages';
import { RemainingCategoryPage as NavigationCategoryPage, RemainingDetailPage as NavigationDetailPage } from './pages/RemainingPages';
function HomePage() {
  return (
    <section>
      <Hero />
      <TrustedBy />
      <FeatureGrid />
      <BrokerSolutions />
      <Technology />
      <Security />
      <Comparison />
      <FAQ />
    </section>
  );
}

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'contact', element: <ContactUs /> },
      { path: 'contact-us', element: <ContactUs /> },
      { path: 'about-us', element: <AboutUs /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'solutions/forex-brokers', element: <ForexBrokers /> },
      { path: 'forex-broker', element: <ForexBrokers /> },
      { path: 'forex-brokers', element: <ForexBrokers /> },
      { path: 'solutions/prop-firms', element: <PropFirms /> },
      { path: 'prop-firms', element: <PropFirms /> },
      { path: 'solutions/liquidity-providers', element: <LiquidityProviders /> },
      { path: 'liquidity-providers', element: <LiquidityProviders /> },
      { path: 'solutions/white-label', element: <WhiteLabel /> },
      { path: 'white-label', element: <WhiteLabel /> },
      { path: 'solutions/introducing-brokers', element: <IntroducingBrokers /> },
      { path: 'introducing-brokers', element: <IntroducingBrokers /> },
      { path: 'solutions/asset-managers', element: <AssetManagers /> },
      { path: 'asset-managers', element: <AssetManagers /> },
      { path: 'platform', element: <PlatformOverview /> },
      { path: 'platform/web-trading', element: <WebTradingPlatform /> },
      ...(['Solutions', 'Technology'] as NavigationCategory[]).map(category => ({ path: category.toLowerCase(), element: <NavigationCategoryPage category={category} /> })),
      ...navigationPages.filter(page => !['White Label', 'Introducing Brokers', 'Asset Managers', 'Web Trading Platform'].includes(page.name)).map(page => ({ path: page.path.slice(1), element: <NavigationDetailPage key={page.path} page={page} /> })),
    ],
  },
];
