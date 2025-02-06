import { useEffect } from 'react';

import Hero from '../components/Hero';
import Features from '../components/Features';
import Solutions from '../components/Solutions';

import Testimonials from '../components/Testimonials';

import Contact from '../components/Contact';
import Footer from '../components/Footer';
import LandingPrice from '../components/LandingPrice';

const Home = () => {
  useEffect(() => {
    // Add any initialization code here
    document.title = 'ManagePro - Business Management Solutions';
  }, []);

  return (
    <div className="antialiased text-gray-800 min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black">
        Skip to main content
      </a>

      {/* <Navbar /> */}

      <main id="main-content" className="flex-1 relative">
        <Hero />
        <Features />
        <Solutions />
        <LandingPrice/>
        {/* <Pricing /> */}
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
