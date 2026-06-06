import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';
import Features from './Features';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import CTA from './CTA';
import Footer from './Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-on-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}