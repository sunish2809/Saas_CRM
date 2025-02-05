interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean; // Optional: Indicates if the plan is popular
  className?: string; // Optional: CSS classes for styling the plan card
  buttonClassName?: string; // Optional: CSS classes for the button styling
  textColorClass?: string; // Optional: Class for text color
  animationDelay?: string; // Optional: Adds animation delay
}

import axios from "axios";
import { FC } from "react";

const Pricing: FC = () => {
  const CheckIcon = () => (
    <svg
      className="w-5 h-5 text-green-500 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  const pricingPlans: PricingPlan[] = [
    {
      name: "Basic",
      price: "₹1,500",
      features: [
        "1 Business (Single Management System)",
        "Up to 250 Users",
        "Basic Analytics",
        "Email Support",
      ],
      buttonText: "Get Started",
      className: "bg-white border border-gray-200",
      buttonClassName: "bg-indigo-600 hover:bg-indigo-700",
      textColorClass: "text-gray-900",
      animationDelay: "",
    },
    {
      name: "Intermediate",
      price: "₹3,000",
      isPopular: true,
      features: [
        "3 Businesses (Each Management System)",
        "Up to 500 Users",
        "Customizable Analytics",
        "24/7 Support",
      ],
      buttonText: "Get Started",
      className:
        "bg-neutral-900 border-2 border-indigo-500 transform scale-105 text-white",
      buttonClassName: "bg-indigo-500 hover:bg-indigo-600",
      textColorClass: "text-white",
      animationDelay: "animate__delay-1s",
    },
    {
      name: "Pro",
      price: "₹5,000",
      features: [
        "All Management Systems",
        "Multiple Businesses",
        "Full Customization (Website, Theme, Colors)",
        "Advanced Analytics",
        "Unlimited Users",
      ],
      buttonText: "Get Started",
      className: "bg-white border border-gray-200",
      buttonClassName: "bg-indigo-600 hover:bg-indigo-700",
      textColorClass: "text-gray-900",
      animationDelay: "animate__delay-2s",
    },
    {
      name: "Lifetime",
      price: "₹50,000",
      features: [
        "One-Time Payment (Lifetime Access)",
        "All Features Unlocked",
        "Unlimited Businesses & Users",
        "Scalable for Future Growth",
        "No Recurring Fees",
      ],
      buttonText: "Buy Now",
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

        {/* Adjusted Grid: 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow animate__animated animate__fadeInUp ${plan.className} ${plan.animationDelay} relative flex flex-col h-full`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                  POPULAR
                </div>
              )}

              <h3
                className={`text-xl font-semibold ${plan.textColorClass} mb-4`}
              >
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className={`text-4xl font-bold ${plan.textColorClass}`}>
                  {plan.price}
                </span>
                <span
                  className={plan.isPopular ? "text-gray-300" : "text-gray-600"}
                >
                  {plan.name === "Lifetime" ? "" : "/month"}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button is always at the bottom */}
              <button

                className={`w-full ${plan.buttonClassName} text-white py-3 rounded-lg transition-colors mt-auto` }
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
