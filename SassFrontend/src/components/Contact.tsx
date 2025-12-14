import { Mail } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Contact Information */}
          <div className="animate__animated animate__fadeInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Get in Touch
            </h2>
            <p className="text-black mb-8">
              Have questions about our management systems?  
              Feel free to reach out via email.
            </p>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-black font-semibold">Phone</h3>
                  <p className="text-black">+91 8955962121</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mail Icon Section */}
          <div className="flex items-center justify-center animate__animated animate__fadeInRight">
            <a
              href="mailto:sunish.5186@mail.com"
              className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center 
                         hover:bg-indigo-700 transition-colors cursor-pointer"
              aria-label="Send Email"
            >
              <Mail className="w-12 h-12 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
