
import {  useNavigate } from "react-router-dom";

export const projects = [
  {
    title: "Library Management",
    description: [
      "A comprehensive system for managing library operations and member interactions.",
      "Features:",
      "CRUD operations for library members and books.",
      "Automatic notification to members for due dates (30 days).",
      "Separate profile page for each library member with complete borrowing history.",
      "Highlights overdue accounts with a RED background.",
      "Visualizations for overdue accounts, active members, and trends in book borrowing over the last 6 months.",
      "Send reminders (WhatsApp) to members directly from their profile.",
    ],
  },
  {
    title: "Gym Management",
    description: [
      "A powerful solution for managing gym members and operations efficiently.",
      "Features:",
      "CRUD operations for gym members and their membership plans.",
      "Automatic notification for payment reminders (30 days).",
      "Separate profile page for each gym member with complete payment and activity details.",
      "Highlights overdue accounts with a RED background.",
      "Visualizations for payment dues, membership trends, and member growth over the last 6 months.",
      "Send personalized messages (WhatsApp) to members directly from their profile.",
    ],
  },
];

const solutions = [
  {
    title: "LIBRARY",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    description:
      "Complete solution for libraries with book tracking, member management, and automated reminders.",
    features: [
      "Member Management: Add, edit, or delete library members and maintain their borrowing history.",
      "Automated Notification System: Send reminders to members for overdue books or upcoming due dates (30 days).",
      "Individual Member Profiles: Detailed profiles for each member, including borrowing history, fines, and personal information.",
      "Dues Highlighting: Automatically highlight overdue members in red for easy identification.",
      "Visual Analytics for Librarians:Overview of dues collected and pending fines.Insights into book borrowing trends and member activity over the past 6 months.",
      "Direct Communication with Members: Send notifications or updates via email or messaging platforms (e.g., WhatsApp).",
    ],
  },
  {
    title: "GYM",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        ></path>
      </svg>
    ),
    description:
      "Complete fitness center management solution with member tracking and scheduling.",
    features: [
      "Member CRUD Operations: Manage gym members, profiles, including membership type, duration, and payment history.",
      "Payment Reminders: Automatic notifications to members for pending membership fees (30 days).",
      "Individual Member Profiles: Separate profiles showcasing attendance, payment history, and workout plans.",
      "Dues Highlighting: Flag members with unpaid fees in red to alert gym staff.",
      "Visual Analytics for Gym Owners:Overview of revenue collected and pending dues. Trends in membership sign-ups and cancellations over the last 6 months.",
      "Direct Messaging: Send personalized WhatsApp messages or emails to individual members from their profiles.",
    ],
  },
  {
    title: "HARDWARE",
    icon: (
      <svg
        className="w-12 h-12"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    description:
      "Complete product and inventory management solution with stock tracking and billing.",
    features: [
      "Product Management: Add products with multiple quantity types (kg, liters, etc.) and track stock levels.",
      "Bill Generation: Create bills with multiple products, quantities, and customer details.",
      "Customer Management: Track customers by phone number, view payment status (Paid/Due), and payment history.",
      "Stock Management: Add new products and update existing stock levels easily.",
      "Payment Tracking: Calculate dues, update customer payments, and view complete payment history.",
      "Inventory Control: Monitor stock levels and get alerts for low stock items.",
    ],
  },
];

const GetStarted = () => {
  const navigate = useNavigate();
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
              className="bg-neutral-50 p-6 flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-shadow animate__animated animate__fadeInUp "
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="mb-4 text-slate-600">{solution.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {solution.title}
              </h3>
              <p className="text-gray-600 mb-4">{solution.description}</p>
              <ul className="text-gray-700 space-y-2 mb-6 flex-grow">
                {solution.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex">
                    <svg
                      className="w-7 h-7 mr-2 text-slate-600 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm">{feature}</p>
                  </div>
                ))}
              </ul>
              <div className="flex gap-2 mt-auto">
                <button 
                  onClick={()=>navigate(`/signin?business=${solution.title}`)} 
                  className="flex-1 bg-slate-700 text-white py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={()=>navigate(`/try-demo?type=${solution.title}`)} 
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg transition-colors font-medium"
                >
                  Try Demo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetStarted;


// ... keep your existing imports and solutions array ...


