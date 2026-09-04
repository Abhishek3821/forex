import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustedBy from './components/TrustedBy';
import FeatureGrid from './components/FeatureGrid';
import BrokerSolutions from './components/BrokerSolutions';
import Technology from './components/Technology';
import Comparison from './components/Comparison';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { Security } from './components/Security';
import ImageCarousel from './components/ImageCarsouel';
import { bannerImage } from './assests';

export default function App() {
  return (
    <>
      <Navbar />
      <section >
        <Hero />

        <TrustedBy />
        <FeatureGrid />
        <BrokerSolutions />
        <Technology />
        <Security />
        <Comparison />
        <FAQ />
      </section>
      <Footer />
    </>
  );
}
