
import { FC } from "react";

const LandingPrice: FC = () => {

  const pricingPlans = [
    {
      name: "Basic",
      price: "1500",
      features: ["1 Business (Single Management System)", "Up to 250 Users", "Basic Analytics", "Email Support"],
      buttonText: "Get Started",
      className: "bg-white border border-gray-200",
      buttonClassName: "bg-indigo-600 hover:bg-indigo-700",
      textColorClass: "text-gray-900",
      animationDelay: "",
    },
    {
      name: "Intermediate",
      price: "3000",
      isPopular: true,
      features: ["3 Businesses (Each Management System)", "Up to 500 Users", "Customizable Analytics", "24/7 Support"],
      buttonText: "Get Started",
      className: "bg-neutral-900 border-2 border-indigo-500 transform scale-105 text-white",
      buttonClassName: "bg-indigo-500 hover:bg-indigo-600",
      textColorClass: "text-white",
      animationDelay: "animate__delay-1s",
    },
    {
      name: "Pro",
      price: "5000",
      features: ["All Management Systems", "Multiple Businesses", "Full Customization (Website, Theme, Colors)", "Advanced Analytics", "Unlimited Users"],
      buttonText: "Get Started",
      className: "bg-white border border-gray-200",
      buttonClassName: "bg-indigo-600 hover:bg-indigo-700",
      textColorClass: "text-gray-900",
      animationDelay: "animate__delay-2s",
    },
    {
      name: "Lifetime",
      price: "50000",
      features: ["One-Time Payment (Lifetime Access)", "All Features Unlocked", "Unlimited Businesses & Users", "Scalable for Future Growth", "No Recurring Fees"],
      buttonText: "Contact Us",
      className: "bg-yellow-500 border border-yellow-600 transform scale-105",
      buttonClassName: "bg-yellow-600 hover:bg-yellow-700",
      textColorClass: "text-white",
      animationDelay: "animate__delay-4s",
    },
  ];

  
  

  
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate__animated animate__fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing for Indian Businesses 🇮🇳
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan tailored to your business growth
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <div key={index} className={`rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow animate__animated animate__fadeInUp ${plan.className} ${plan.animationDelay} relative flex flex-col h-full`}>
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                  POPULAR
                </div>
              )}
  
              <h3 className={`text-xl font-semibold ${plan.textColorClass} mb-4`}>
                {plan.name}
              </h3>
  
              {/* Show price per month except for Lifetime */}
              <p className={`text-4xl font-bold ${plan.textColorClass}`}>
                ₹{plan.price} {plan.name !== "Lifetime" && <span className="text-gray-500 text-lg">/ month</span>}
              </p>
  
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    ✔ {feature}
                  </li>
                ))}
              </ul>
  
            </div>
          ))}
        </div>
      </div>
    </section>
  );
  
};

export default LandingPrice;


