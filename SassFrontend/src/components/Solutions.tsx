import { useNavigate } from "react-router-dom";
const Solutions = () => {
  const navigate = useNavigate()
    const solutions = [
      {
        title: "Library Management",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        description: "Complete solution for libraries with book tracking, member management, and automated reminders.",
        features: ["Catalog Management", "Member Database", "Fine Management"]
      },
      {
        title: "Flat Management",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        ),
        description: "Comprehensive solution for residential property management and maintenance tracking.",
        features: ["Tenent Management", "Maintainence Request", "Billing Invoice"]
      },
      {
        title: "Gym Management",
        icon: (
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        ),
        description: "Complete fitness center management solution with member tracking and scheduling.",
        features: ["Member Tracking", "Class Scheduling", "Equipment Management"]
      },
      // Add other solutions...
    ];
  
    return (
      <section id="solutions" className="bg-white-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate__animated animate__fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Specialized Solutions for Every Industry
            </h2>
            <p className="text-lg text-black-300 max-w-2xl mx-auto">
              Choose the perfect management system tailored to your business needs
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <div 
                key={index}
                // className="bg-neutral-800 rounded-xl p-6 hover:bg-neutral-700 transition-all cursor-pointer animate__animated animate__fadeInUp"
                // style={{ animationDelay: `${index * 0.2}s` }}
                className="bg-neutral-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow animate__animated animate__fadeInUp"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="mb-4 text-indigo-500">
                  {solution.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{solution.title}</h3>
                <p className="text-gray-400 mb-4">{solution.description}</p>
                <ul className="text-black-300 space-y-2 mb-6">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button onClick={()=>navigate('/get-started')} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Solutions;