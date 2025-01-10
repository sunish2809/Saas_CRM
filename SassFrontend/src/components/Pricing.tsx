interface PricingPlan {
    name: string;
    price: string;
    isPopular?: boolean;
    features: string[];
    buttonText: string;
    className?: string;
    buttonClassName?: string;
    textColorClass?: string;
    animationDelay?: string;
  }
  
  const Pricing = () => {
    const CheckIcon = () => (
      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    );
  
    const pricingPlans: PricingPlan[] = [
      {
        name: "Starter",
        price: "$29",
        features: [
          "Single Management System",
          "Up to 100 Users",
          "Basic Analytics",
          "Email Support"
        ],
        buttonText: "Get Started",
        className: "bg-white border border-gray-200",
        buttonClassName: "bg-indigo-600 hover:bg-indigo-700",
        textColorClass: "text-gray-900",
        animationDelay: ""
      },
      {
        name: "Professional",
        price: "$79",
        isPopular: true,
        features: [
          "Multiple Management Systems",
          "Up to 500 Users",
          "Advanced Analytics",
          "24/7 Priority Support"
        ],
        buttonText: "Get Started",
        className: "bg-neutral-900 border-2 border-indigo-500 transform scale-105",
        buttonClassName: "bg-indigo-500 hover:bg-indigo-600",
        textColorClass: "text-white",
        animationDelay: "animate__delay-1s"
      },
      {
        name: "Enterprise",
        price: "$149",
        features: [
          "All Management Systems",
          "Unlimited Users",
          "Custom Analytics",
          "Dedicated Support Manager"
        ],
        buttonText: "Contact Sales",
        className: "bg-white border border-gray-200",
        buttonClassName: "bg-indigo-600 hover:bg-indigo-700",
        textColorClass: "text-gray-900",
        animationDelay: "animate__delay-2s"
      }
    ];
  
    return (
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate__animated animate__fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business needs
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow animate__animated animate__fadeInUp ${plan.className} ${plan.animationDelay} relative`}
              >
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                    POPULAR
                  </div>
                )}
                
                <h3 className={`text-xl font-semibold ${plan.textColorClass} mb-4`}>
                  {plan.name}
                </h3>
                
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.textColorClass}`}>
                    {plan.price}
                  </span>
                  <span className={plan.isPopular ? "text-gray-300" : "text-gray-600"}>
                    /month
                  </span>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className={`flex items-center ${plan.isPopular ? 'text-gray-300' : ''}`}
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full ${plan.buttonClassName} text-white py-3 rounded-lg transition-colors`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Pricing;
