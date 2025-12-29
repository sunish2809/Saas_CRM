import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../components/api";
import { Play, Loader2 } from "lucide-react";

const DEMO_ACCOUNTS = {
  GYM: {
    email: "demo.gym@example.com",
    password: "Demo@1234",
    businessType: "GYM"
  },
  LIBRARY: {
    email: "demo.library@example.com",
    password: "Demo@1234",
    businessType: "LIBRARY"
  },
  HARDWARE: {
    email: "demo.hardware@example.com",
    password: "Demo@1234",
    businessType: "HARDWARE"
  }
};

function TryDemo() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const businessTypeParam = searchParams.get("type")?.toUpperCase() || "GYM";
  
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>(businessTypeParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = async (businessType: string) => {
    setLoading(true);
    setError("");
    
    const demoAccount = DEMO_ACCOUNTS[businessType as keyof typeof DEMO_ACCOUNTS];
    
    if (!demoAccount) {
      setError("Invalid business type selected");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/signin", {
        email: demoAccount.email,
        password: demoAccount.password,
        businessType: demoAccount.businessType,
      });

      const { token, user } = response.data;

      // Store authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isDemoAccount", "true"); // Mark as demo account
      
      // Navigate to the dashboard
      navigate(`/dashboard/${demoAccount.businessType.toLowerCase()}`);
    } catch (err: any) {
      console.error("Demo login error:", err);
      const errorMessage = err.response?.data?.message || "Failed to login to demo account";
      setError(errorMessage);
      
      // If demo account doesn't exist, show message
      if (err.response?.status === 401) {
        setError(`Demo account not found. Please contact support or use: ${demoAccount.email} / ${demoAccount.password}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const businessTypes = [
    { id: "GYM", name: "Gym Management", icon: "💪", description: "Manage gym members, memberships, and payments" },
    { id: "LIBRARY", name: "Library Management", icon: "📚", description: "Track books, members, and borrowing history" },
    { id: "HARDWARE", name: "Product Management", icon: "🔧", description: "Manage products, inventory, bills, and customers" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Try Our Demo
          </h1>
          <p className="text-lg text-gray-600">
            Experience our management systems with pre-configured demo accounts
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {businessTypes.map((type) => {
            const isSelected = selectedBusinessType === type.id;
            const isLoading = loading && isSelected;
            
            return (
              <div
                key={type.id}
                className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all ${
                  isSelected
                    ? "border-purple-500 shadow-xl scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">{type.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Email:</strong> {DEMO_ACCOUNTS[type.id as keyof typeof DEMO_ACCOUNTS].email}</p>
                    <p><strong>Password:</strong> {DEMO_ACCOUNTS[type.id as keyof typeof DEMO_ACCOUNTS].password}</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedBusinessType(type.id);
                      handleDemoLogin(type.id);
                    }}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        <span>Try {type.name} Demo</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Demo accounts are read-only and reset periodically
          </p>
          <button
            onClick={() => navigate("/get-started")}
            className="text-slate-600 hover:text-slate-800 font-medium"
          >
            Or create your own account →
          </button>
        </div>
      </div>
    </div>
  );
}

export default TryDemo;

