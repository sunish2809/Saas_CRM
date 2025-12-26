import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import GymDashboard from "./pages/dashboards/Gym/GymDashboard";
import "animate.css";
import GetStarted from "./components/GetStarted";
import MemberProfile from "./pages/dashboards/Gym/MemberProfile";
import LibraryDashboard from "./pages/dashboards/Library/LibraryDashboard";
import MemberProfileLibrary from "./pages/dashboards/Library/MemberProfileLibrary";
import Pricing from "./components/Pricing";
import TryDemo from "./pages/TryDemo";


function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />

      <Route path="/pricing" element= {<Pricing/>}/>
      
      <Route path="/get-started" element={<GetStarted />} />
      <Route path="/try-demo" element={<TryDemo />} />
      {/* Auth routes - support both patterns */}
      <Route path="/signin" element={<SignIn />} /> {/* For query params */}
      <Route path="/signup" element={<SignUp />} /> {/* For query params */}
      <Route path="/signin/:businessType" element={<SignIn />} />{" "}
      {/* For path params */}
      <Route path="/signup/:businessType" element={<SignUp />} />{" "}
      {/* Password reset routes */}
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* Protected dashboard routes */}
      <Route
        path="/dashboard/gym/*"
        element={
          <ProtectedRoute requiredBusinessType="gym">
            <GymDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/library/*"
        element={
          <ProtectedRoute requiredBusinessType="library">
            <LibraryDashboard />
          </ProtectedRoute>
        }
      />
      {/* Protected member routes */}
      <Route
        path="/dashboard/gym/members/:memberId"
        element={
          <ProtectedRoute requiredBusinessType="gym">
            <MemberProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/library/members/:memberId"
        element={
          <ProtectedRoute requiredBusinessType="library">
            <MemberProfileLibrary/>
          </ProtectedRoute>
        }
      />
      {/* Fallback route */}
      <Route path="*" element={<Home/>} />
    </Routes>
  );
}

export default App;
