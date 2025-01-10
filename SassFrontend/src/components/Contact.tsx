import { FormEvent, useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    system: '',
    message: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Add your form submission logic here
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({ name: '', email: '', system: '', message: '' });
  };

  return (
    <section id="contact" className="bg-white-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="animate__animated animate__fadeInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Get in Touch
            </h2>
            <p className="text-black-300 mb-8">
              Have questions about our management systems? We're here to help you choose the right solution for your business.
            </p>
            
            <div className="space-y-6">
              {/* Contact details */}
              {[
                {
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />,
                  title: "Phone",
                  content: "+1 (555) 123-4567"
                },
                // Add email and location details
              ].map((detail, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {detail.icon}
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-black font-semibold">{detail.title}</h3>
                    <p className="text-black-300">{detail.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white-800 rounded-xl p-8 animate__animated animate__fadeInRight">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-black mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white-700 border border-neutral-600 text-black focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Add other form fields */}

              <button type="submit" className="w-full bg-indigo-600 text-black py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;