import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
