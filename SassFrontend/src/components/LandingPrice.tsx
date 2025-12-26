
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const LandingPrice: FC = () => {
  const navigate = useNavigate();

  const pricingPlans = [
    {
      name: "Starter",
      price: "999",
      features: [
        "1 Business Type (Gym/Library)",
        "Up to 100 Members",
        "Member CRUD Operations",
        "Payment History Tracking",
        "Basic Analytics Dashboard",
        "Excel Import/Export",
        "Payment Reminders (30 days)",
        "Member Profile Pages",
        "Email Support"
      ],
      buttonText: "Get Started",
      className: "bg-white border border-gray-200",
      buttonClassName: "bg-slate-600 hover:bg-slate-700",
      textColorClass: "text-gray-900",
      animationDelay: "",
    },
    {
      name: "Professional",
      price: "1999",
      isPopular: true,
      features: [
        "All 2 Business Types (Gym + Library)",
        "Up to 500 Members",
        "Advanced Analytics & Charts",
        "Revenue Tracking & Reports",
        "Monthly Trend Analysis",
        "WhatsApp Messaging Integration",
        "Bulk Member Upload (Excel)",
        "Overdue Account Alerts",
        "Priority Email Support"
      ],
      buttonText: "Get Started",
      className: "bg-slate-800 border-2 border-slate-600 transform scale-105 text-white",
      buttonClassName: "bg-slate-600 hover:bg-slate-700",
      textColorClass: "text-white",
      animationDelay: "animate__delay-1s",
    },
    {
      name: "Enterprise",
      price: "3999",
      features: [
        "All Business Types",
        "Unlimited Members",
        "Advanced Analytics Dashboard",
        "Year-wise Data Analysis",
        "Membership Distribution Reports",
        "WhatsApp Bulk Messaging",
        "Custom Payment Reminders",
        "Data Export (CSV/Excel)",
        "Dedicated Support Channel"
      ],
      buttonText: "Get Started",
      className: "bg-white border border-gray-200",
      buttonClassName: "bg-slate-600 hover:bg-slate-700",
      textColorClass: "text-gray-900",
      animationDelay: "animate__delay-2s",
    },
    {
      name: "Lifetime",
      price: "29999",
      features: [
        "One-Time Payment (Lifetime Access)",
        "All Features from Enterprise Plan",
        "Unlimited Everything",
        "Future Feature Updates",
        "Priority Feature Requests",
        "No Recurring Fees Ever",
        "Best Value for Long-term"
      ],
      buttonText: "Contact Us",
      className: "bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-amber-600 transform scale-105",
      buttonClassName: "bg-amber-600 hover:bg-amber-700",
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
                <div className="absolute top-0 right-0 bg-slate-600 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
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
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-slate-600 mr-2">✔</span>
                    <span className={plan.textColorClass}>{feature}</span>
                  </li>
                ))}
              </ul>
  
              <button
                onClick={() => navigate('/get-started')}
                className={`w-full ${plan.buttonClassName} text-white py-3 rounded-lg transition-colors mt-auto font-medium`}
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

export default LandingPrice;


