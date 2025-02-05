

// import { useState } from 'react';
// import Sidebar from './Sidebar';
// import Home from './Home';
// import AddMember from './AddMember';
// import MemberList from './MemberList';
// import Analytics from './Analytics';
// import Settings from './Settings';
// import Profile from './MemberProfile';


// const GymDashboard = () => {
//   const [currentPage, setCurrentPage] = useState('');
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const renderPage = () => {
//     switch (currentPage) {
//       // case 'home':
//       //   return <Home />;
//       case 'add':
//         return <AddMember />;
//       case 'list':
//         return <MemberList />;
//       // case 'analytics':
//       //   return <Analytics />;
//       case 'settings':
//         return <Settings />;
//       case 'profile':
//         return <Profile />;
//       default:
//         return <Analytics />;
//       // default:
//       //   return <Home />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar 
//         currentPage={currentPage} 
//         setCurrentPage={setCurrentPage}
//         isMobileMenuOpen={isMobileMenuOpen}
//         setIsMobileMenuOpen={setIsMobileMenuOpen}
//       />
      
//       <main className="flex-1 ml-0 lg:ml-64">
//         {renderPage()}
//       </main>
//     </div>
//   );
// };

// export default GymDashboard;


import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Analytics from "./Analytics";
import Settings from "./Settings";
import MemberList from "./MemberList";
import AddMember from "./AddMember";
// import MemberProfile from "./MemberProfile";

const GymDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar remains fixed */}
      <Sidebar />

      {/* Main content with routes */}
      <main className="flex-1 ml-64 bg-gray-100 overflow-y-auto">
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
