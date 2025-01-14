// import { useAuth0 } from '@auth0/auth0-react';

// function GymDashboard() {
//   const { /*user,*/ logout } = useAuth0();
  

//   return (
//     <div>
//       <header>
//         <h1>Library Management Dashboard</h1>
//         <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
//           Logout
//         </button>
//       </header>
//       <nav>
//         {/* Add your navigation menu here */}
//       </nav>
//       <main>
//         {/* Add your dashboard content here */}
//       </main>
//     </div>
//   );
// }

// export default GymDashboard;

import { useState } from 'react';
import Sidebar from './Sidebar';
import Home from './Home';
import AddMember from './AddMember';
import MemberList from './MemberList';
import Analytics from './Analytics';
import Settings from './Settings';
import Profile from './MemberProfile';


const GymDashboard = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'add':
        return <AddMember />;
      case 'list':
        return <MemberList />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 ml-0 lg:ml-64">
        {renderPage()}
      </main>
    </div>
  );
};

export default GymDashboard;