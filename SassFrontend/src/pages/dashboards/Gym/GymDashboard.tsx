import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Analytics from "./Analytics";
import Settings from "./Settings";
import MemberList from "./MemberList";
import AddMember from "./AddMember";
import MemberProfile from "./MemberProfile";
import Home from "./Home";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AlertCircle } from "lucide-react";
import PlanInfoBanner from "../../../components/PlanInfoBanner";
import DemoBanner from "../../../components/DemoBanner";

function GymDashboard() {
  const navigate = useNavigate();
  const [trialStatus, setTrialStatus] = useState(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/owner/get-owner`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const user = response.data;
        setTrialStatus(user.trialStatus);
        setUserData(user);
        if (user.trialStatus === "EXPIRED") {
          navigate("/pricing");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (trialStatus === "EXPIRED") {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        {/* Demo Banner */}
        <DemoBanner themeColor="orange" />
        
        {/* Plan Info Banner */}
        {userData && (
          <PlanInfoBanner
            membershipType={userData.membershipType || "None"}
            allBusinessTypes={userData.allBusinessTypes || [userData.businessType]}
            currentBusinessType={userData.currentBusinessType || userData.businessType}
            themeColor="orange"
          />
        )}
        
        {/* Trial Warning Banner */}
        {trialStatus === "TRIAL" && (
          <div className="bg-orange-50 border-b border-orange-200">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4 max-w-screen-2xl mx-auto">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <p className="text-sm text-orange-900">
                  Your trial ends soon! Upgrade now to continue using the platform.
                </p>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors whitespace-nowrap"
              >
                Upgrade
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="members" element={<MemberList />} />
            <Route path="member/:memberId" element={<MemberProfile />} />
            <Route path="add-member" element={<AddMember />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default GymDashboard;