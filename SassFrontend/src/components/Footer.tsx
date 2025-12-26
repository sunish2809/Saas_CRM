const Footer = () => {
    const footerSections = {
      solutions: ["Library Management", "Gym Management", "Custom Solutions"],
      // company: ["About Us", "Careers", "Blog", "Press"],
      // support: ["Help Center", "Documentation", "API Status", "Contact Us"]
    };
  
    return (
      <footer id="footer" className="bg-neutral-900 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">ManagePro</h3>
              <p className="text-gray-400">
                Comprehensive management solutions for businesses of all sizes.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons */}
                {/* Add your social media icons here */}
              </div>
            </div>
  
            {/* Footer Sections */}
            {Object.entries(footerSections).map(([title, items]) => (
              <div key={title}>
                <h4 className="text-lg font-semibold text-white mb-4 capitalize">{title}</h4>
                <ul className="space-y-3">
                  {items.map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
  
          {/* Footer Bottom */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} ManagePro. All rights reserved.
              </div>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;