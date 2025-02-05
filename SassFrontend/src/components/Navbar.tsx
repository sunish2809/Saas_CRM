import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";


const Navbar = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (e:any) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const target = document.querySelector(targetId);

    target.scrollIntoView({
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  return (
    <nav
      id="navbar"
      className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <a href="#" className="text-black font-bold text-xl">
              ManagePro
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              onClick={handleScroll}
              className="text-black-300 hover:text-black transition-colors"
            >
              Features
            </a>
            <a
              onClick={handleScroll}
              href="#solutions"
              className="text-black-300 hover:text-black transition-colors"
            >
              Solutions
            </a>
            <a
              onClick={handleScroll}
              href="#pricing"
              className="text-black-300 hover:text-black transition-colors"
            >
              Pricing
            </a>
            <a
              onClick={handleScroll}
              href="#testimonials"
              className="text-black-300 hover:text-black transition-colors"
            >
              Testimonials
            </a>
            {/* <a
              onClick={handleScroll}
              href="#integration"
              className="text-black-300 hover:text-black transition-colors"
            >
              Integration
            </a> */}
            <a
              onClick={handleScroll}
              href="#contact"
              className="text-black-300 hover:text-black transition-colors"
            >
              Contact
            </a>
            {/* <button className="bg-[#146eb4] text-white px-4 py-2 rounded-md hover:bg-[#0b1d2b] transition ease-in-out duration-150">
              Sign In
            </button> */}
          </div>

          {/* Mobile menu button */}
          {/* <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div> */}
        </div>
      </div>

      {/* Mobile Menu */}

      {/* {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block text-gray-300 hover:text-white py-2 px-3 rounded-md">Features</a>

            </div>
          </div>
        )} */}
    </nav>
  );
};

export default Navbar;
