// import { useAuth0 } from '@auth0/auth0-react';
// //import { useApi } from '../../../components/api';

// function LibraryDashboard() {
//   const { user, logout } = useAuth0();

//   return (
//     <div>
//       <header>
//         <h1>Library Dashboard</h1>
//         <div>
//           <span>Welcome, {user?.name}</span>
//           <button onClick={() => logout({
//             logoutParams: { returnTo: window.location.origin }
//           })}>
//             Logout
//           </button>
//         </div>
//       </header>
//       {/* Dashboard content */}
//     </div>
//   );
// }

// export default LibraryDashboard;
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Analytics from './AnalyticsOverview';
import Settings from './Settings';
import MemberList from './MemberList';
import AddMember from './AddMember';

function LibraryDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 bg-gray-50 overflow-y-auto">
        <Routes>
          <Route path="analytics" element={<Analytics />} />
          <Route path="members" element={<MemberList />} />
          <Route path="add-member" element={<AddMember />} />
          <Route path="settings" element={<Settings />} />
          {/* Redirect root path to analytics */}
          <Route path="/" element={<Navigate to="analytics" replace />} />
        </Routes>
      </main>
    </div>
  );
}
export default LibraryDashboard;