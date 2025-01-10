const Integration = () => {
    const integrations = [
      {
        icon: (
          <svg className="w-12 h-12 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
        title: "Payment Gateways"
      },
      {
        icon: (
          <svg className="w-12 h-12 text-indigo-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        title: "Calendar Apps"
      },
      // Add other integrations...
    ];
  
    return (
      <section id="integration" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate__animated animate__fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Seamless Integration Ecosystem
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with your favorite tools and services effortlessly
            </p>
          </div>
  
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {integrations.map((integration, index) => (
              <div 
                key={index}
                className="bg-neutral-100 p-6 rounded-xl flex flex-col items-center justify-center hover:shadow-lg transition-shadow animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {integration.icon}
                <span className="text-gray-700 font-medium">{integration.title}</span>
              </div>
            ))}
          </div>
  
          <div className="bg-neutral-900 rounded-2xl p-8 md:p-12 mt-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="animate__animated animate__fadeInLeft">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to integrate with your tools?
                </h3>
                <p className="text-gray-300 mb-6">
                  Our API documentation makes it easy to connect with your existing business tools and workflows.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
                    View Documentation
                  </button>
                  <button className="border border-gray-300 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
              <div className="animate__animated animate__fadeInRight">
                <div className="bg-neutral-800 rounded-lg p-6">
                  <pre className="text-gray-300 overflow-x-auto">
                    <code>
  {`{
    "api_key": "your_api_key",
    "service": "library_management",
    "action": "sync_data",
    "parameters": {
      "integrate_with": "calendar"
    }
  }`}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Integration;