import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Analytics from "./AnalyticsOverview";
import Settings from "./Settings";
import MemberList from "./MemberList";
import AddMember from "./AddMember";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function LibraryDashboard() {
  const navigate = useNavigate();
  const [trialStatus, setTrialStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // To prevent flickering while fetching

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/signin"); // Redirect to sign-in if no token found
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/owner/get-owner`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const user = response.data;
        setTrialStatus(user.trialStatus);
        
        if (user.trialStatus === "EXPIRED") {
          alert("Your trial has expired! Please upgrade your plan.");
          navigate("/pricing"); // Redirect immediately to the pricing page
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/signin"); // Redirect to sign-in on error
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  

  // **If the trial is expired, prevent rendering the dashboard**
  if (trialStatus === "EXPIRED") {
    return null; // Return nothing, as the user is being redirected
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 bg-[#F0F0D7] overflow-y-auto">
        {trialStatus === "TRIAL" && (
          <div className="flex align-middle">
            <div className="bg-yellow-200 text-yellow-800 p-4 mt-4 rounded">
              Your trial ends soon! Upgrade now to continue using the platform.
            </div>
            <b>
              <button
                className="ml-auto text-400 p-4 mt-4 rounded"
                onClick={() => navigate("/pricing")}
              >
                Upgrade
              </button>
            </b>
          </div>
        )}

        <Routes>
          <Route path="analytics" element={<Analytics />} />
          <Route path="members" element={<MemberList />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="analytics" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default LibraryDashboard;
