
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import api from "../components/api";

function SignIn() {
  const navigate = useNavigate();
  const { businessType: pathBusinessType } = useParams<{ businessType?: string }>();
  const [searchParams] = useSearchParams();
  const queryBusinessType = searchParams.get("business");

  const businessType = (pathBusinessType || queryBusinessType)?.toUpperCase();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
        console.log("code is here")
        alert("Your trial has expired! Please upgrade your plan.");
        navigate("/")

      }
      else{
        // Navigate to the dashboard
      navigate(`/dashboard/${businessType?.toLowerCase()}`);

      }

      // Navigate to the dashboard
      //navigate(`/dashboard/${businessType?.toLowerCase()}`);
      
    } catch (err: any) {
      console.error("SignIn error:", err);
      setError(err.response?.data?.message || "An error occurred during sign in");
    } finally {
      setLoading(false);
    }
  };

  if (!businessType) {
    navigate("/get-started");
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

