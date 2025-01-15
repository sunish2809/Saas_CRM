import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";
import GymDashboard from "./pages/dashboards/Gym/GymDashboard";
import FlatDashboard from "./pages/dashboards/Flat/FlatDashboard";
import "animate.css";
import GetStarted from "./components/GetStarted";
import MemberProfile from "./pages/dashboards/Gym/MemberProfile";
import LibraryDashboard from "./pages/dashboards/Library/LibraryDashboard";

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/signin" element={<SignIn />} />
//       <Route path="/signup" element={<SignUp />} />

//       <Route path="/member/:memberId" element={<MemberProfile />} />
//       <Route path="/get-started" element={<GetStarted/>}/>
//       {/* Protected Dashboard Routes */}
//       <Route path="/dashboard">
//         <Route
//           path="library"
//           element={
//             <ProtectedRoute>
//               <LibraryDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="gym"
//           element={
//             <ProtectedRoute>
//               <GymDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="flat"
//           element={
//             <ProtectedRoute>
//               <FlatDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Route>
//     </Routes>
//   );
// }

// export default App;

// ... other imports

// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import GetStarted from './pages/GetStarted';
// import GymDashboard from './pages/dashboards/Gym/GymDashboard';
// import LibraryDashboard from './pages/dashboards/Library/LibraryDashboard';
// import FlatDashboard from './pages/dashboards/Flat/FlatDashboard';
// import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/get-started" element={<GetStarted />} />
      {/* Auth routes - support both patterns */}
      <Route path="/signin" element={<SignIn />} /> {/* For query params */}
      <Route path="/signup" element={<SignUp />} /> {/* For query params */}
      <Route path="/signin/:businessType" element={<SignIn />} />{" "}
      {/* For path params */}
      <Route path="/signup/:businessType" element={<SignUp />} />{" "}
      {/* For path params */}
      {/* <Route path="/member/:memberId" element={<MemberProfile />} /> */}
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
      <Route
        path="/dashboard/flat/*"
        element={
          <ProtectedRoute requiredBusinessType="flat">
            <FlatDashboard />
          </ProtectedRoute>
        }
      />
      {/* Protected member routes */}
      <Route
        path="/dashboard/gym/member/:memberId"
        element={
          <ProtectedRoute requiredBusinessType="gym">
            <MemberProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/library/member/:memberId"
        element={
          <ProtectedRoute requiredBusinessType="library">
            <MemberProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/flat/member/:memberId"
        element={
          <ProtectedRoute requiredBusinessType="flat">
            <MemberProfile />
          </ProtectedRoute>
        }
      />
      {/* Fallback route */}
      <Route path="*" element={<Home/>} />
    </Routes>
  );
}

export default App;
