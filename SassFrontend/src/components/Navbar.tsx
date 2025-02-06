import { useEffect, useState } from "react";


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

            <a
              onClick={handleScroll}
              href="#contact"
              className="text-black-300 hover:text-black transition-colors"
            >
              Contact
            </a>

          </div>

        </div>
      </div>


    </nav>
  );
};

export default Navbar;
