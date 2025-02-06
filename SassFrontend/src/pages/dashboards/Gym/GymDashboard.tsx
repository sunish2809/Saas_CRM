


import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Analytics from "./Analytics";
import Settings from "./Settings";
import MemberList from "./MemberList";
import AddMember from "./AddMember";
import axios from "axios";
import { useEffect, useState } from "react";
// import MemberProfile from "./MemberProfile";

const GymDashboard = () => {
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
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  // **If the trial is expired, prevent rendering the dashboard**
  if (trialStatus === "EXPIRED") {
    return null; // Return nothing, as the user is being redirected
  }
  return (
    <div className="flex">
      {/* Sidebar remains fixed */}
      <Sidebar />

      {/* Main content with routes */}
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
          {/* <Route path="profile/:memberId" element={<MemberProfile />} /> */}
          
          {/* Redirect default route to analytics */}
          <Route path="/" element={<Navigate to="analytics" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default GymDashboard;


