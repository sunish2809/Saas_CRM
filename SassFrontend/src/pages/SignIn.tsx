
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../components/api";

function SignIn() {
  const navigate = useNavigate();
  const { businessType: pathBusinessType } = useParams<{ businessType?: string }>();
  const [searchParams] = useSearchParams();
  const queryBusinessType = searchParams.get("business");

  const businessType = (pathBusinessType || queryBusinessType)?.toUpperCase();

  useEffect(() => {
    if (!businessType) {
      navigate("/get-started");
    }
  }, [businessType, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [availableBusinessTypes, setAvailableBusinessTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
        businessType: businessType,
      });

      const { token, user } = response.data;

      // Store authentication details
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      // Check trial status
      if (user.trialStatus === "EXPIRED") {
        // Allow expired users to sign in but redirect to pricing to upgrade
        alert("Your trial has expired! Please upgrade your plan to continue.");
        navigate("/pricing");
      } else {
        // Navigate to the dashboard for active users
        navigate(`/dashboard/${businessType?.toLowerCase()}`);
      }

      // Navigate to the dashboard
      //navigate(`/dashboard/${businessType?.toLowerCase()}`);
      
    } catch (err: any) {
      console.error("SignIn error:", err);
      const errorResponse = err.response?.data;
      
      // Check if it's a business type access restriction
      if (err.response?.status === 403 && errorResponse?.upgradeRequired) {
        setUpgradeMessage(errorResponse.message || "Your plan doesn't allow access to this business type.");
        setAvailableBusinessTypes(errorResponse.availableBusinessTypes || []);
        setError(""); // Clear regular error
      } else {
        setError(errorResponse?.message || "An error occurred during sign in");
        setUpgradeMessage(""); // Clear upgrade message
        setAvailableBusinessTypes([]);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!businessType) {
    return null;
  }

  return (
    <div className="w-full z-50 bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center bg-[url('https://mydukaan.io/_next/static/media/banner-home-main.ebd707dd321420dd97b2e08e0aa39020.webp')] ">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">{businessType} Management System</p>
        </div>

        {error && (
          <div className="rounded-md bg-red-100 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {upgradeMessage && (
          <div className="rounded-md bg-orange-50 border border-orange-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-orange-900 mb-1">Starter Plan Limitation</h3>
                <p className="text-sm text-orange-800 mb-3">{upgradeMessage}</p>
                {availableBusinessTypes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-orange-900 mb-2">You currently have access to:</p>
                    <div className="flex flex-wrap gap-2">
                      {availableBusinessTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const lowerType = type.toLowerCase();
                            navigate(`/signin?business=${lowerType}`);
                            setUpgradeMessage("");
                            setAvailableBusinessTypes([]);
                          }}
                          className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded-md text-xs font-medium hover:bg-orange-200 transition-colors"
                        >
                          {type} Management
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/pricing")}
                    className="px-4 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                  {availableBusinessTypes.length > 0 && (
                    <button
                      onClick={() => {
                        const firstType = availableBusinessTypes[0].toLowerCase();
                        navigate(`/signin?business=${firstType}`);
                        setUpgradeMessage("");
                        setAvailableBusinessTypes([]);
                      }}
                      className="px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-md text-sm font-medium hover:bg-orange-50 transition-colors"
                    >
                      Sign in to {availableBusinessTypes[0]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate(`/forgot-password?business=${businessType}`)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mt-1"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate(`/signup?business=${businessType}`)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

