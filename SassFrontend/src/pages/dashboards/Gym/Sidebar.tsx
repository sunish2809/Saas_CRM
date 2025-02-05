// import { IoMdHome } from "react-icons/io";
// import { IoMdAdd } from "react-icons/io";
// import { IoMdList } from "react-icons/io";
// import { IoMdAnalytics } from "react-icons/io";
// import { IoMdSettings } from "react-icons/io";
// import { IoMdLogOut } from "react-icons/io";
// import { useAuth0 } from '@auth0/auth0-react';
// interface SidebarProps {
//     currentPage: string;
//     setCurrentPage: (page: string) => void;
//     isMobileMenuOpen: boolean;
//     setIsMobileMenuOpen: (isOpen: boolean) => void;
//   }
  
//   const Sidebar = ({ 
//     currentPage, 
//     setCurrentPage, 
//     isMobileMenuOpen, 
//     setIsMobileMenuOpen 
//   }: SidebarProps) => {
//     const navItems = [
//       // { id: 'home', label: 'Home', icon: IoMdHome },
//       { id: 'add', label: 'Add', icon: IoMdAdd },
//       { id: 'list', label: 'List', icon: IoMdList },
//       { id: 'analytics', label: 'Analytics', icon: IoMdAnalytics },
//     ];
  
//     const bottomNavItems = [
//       { id: 'settings', label: 'Settings', icon: 'SettingsIcon' },
//       { id: 'logout', label: 'Logout', icon: 'LogoutIcon', className: 'text-red-400' },
//     ];

//     const {  logout } = useAuth0();
  
  
//     return (
//       <>
//         {/* Desktop Sidebar */}
//         <nav className="fixed top-0 left-0 h-screen w-64 bg-neutral-800 text-neutral-300 border-r border-neutral-700 lg:block hidden">
//           <div className="p-4 border-b border-neutral-700">
//             <h1 className="text-xl font-bold text-white">GYM MANAGER</h1>
//           </div>
          
//           <div className="py-4">
//             {navItems.map((item) => (
//               <a
//                 key={item.id}
//                 href={`#${item.id}`}
//                 className={`flex items-center px-4 py-3 transition-colors duration-200 ease-in-out hover:bg-neutral-700 ${
//                   currentPage === item.id ? 'bg-neutral-700 text-white' : ''
//                 }`}
//                 onClick={() => setCurrentPage(item.id)}
//               >
//                 <item.icon  className="mr-2"/>
//                 {item.label}
//               </a>
//             ))}
//           </div>
          
//           {/* Bottom Navigation */}
//           <div className="absolute bottom-0 w-full border-t border-neutral-700">
//             {bottomNavItems.map((item) => (
//               <a
//                 key={item.id}
//                 href={`#${item.id}`}
//                 className={`flex items-center px-4 py-3 transition-colors duration-200 ease-in-out hover:bg-neutral-700 ${
//                   item.className || ''
//                 }`}
//                 onClick={() => {
//                   if (item.id === 'logout') {
//                     logout({ logoutParams: { returnTo: window.location.origin } });
//                   } else {
//                     setCurrentPage(item.id);
//                   }
//                 }}
//               >
//                 {/* Using dynamic import for icons since they are strings */}
//                 <span className="mr-2">
//                   {item.icon === 'SettingsIcon' && <IoMdSettings />}
//                   {item.icon === 'LogoutIcon' && <IoMdLogOut />}
//                 </span>
//                 {item.label}
//               </a>
//             ))}
//           </div>
//         </nav>
  
//         {/* Mobile Menu Button and Overlay */}
//         <button
//           type="button"
//           className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-neutral-800 p-2 text-neutral-400 hover:text-white"
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//         >
//           {/* Add your menu icon here */}
//         </button>
  
//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="lg:hidden fixed inset-0 z-40 bg-neutral-800/80 backdrop-blur-lg">
//             {/* Mobile menu content */}
//           </div>
//         )}
//       </>
//     );
//   };
  
//   export default Sidebar;



import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavItem {
  id: string;
  title: string;
  icon: JSX.Element;
  path: string;
}

const navigationItems: NavItem[] = [
  {
    id: "analytics",
    title: "Analytics",
    path: "/dashboard/gym/analytics",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
    ),
  },
  {
    id: "members",
    title: "Members",
    path: "/dashboard/gym/members",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
        />
      </svg>
    ),
  },
  {
    id: "add-member",
    title: "Add Member",
    path: "/dashboard/gym/add-member",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
        />
      </svg>
    ),
  },
  {
    id: "settings",
    title: "Settings",
    path: "/dashboard/gym/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
        />
      </svg>
    ),
  },
];

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-64 h-screen bg-[#D0DDD0] border-r border-gray-200 fixed">
        <div className="p-4 border-b border-gray-200 flex items-center">
          <svg className="w-8 h-8 text-[#727D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
            />
          </svg>
          <h1 className="ml-2 text-xl font-bold text-[#727D73]">Gym Manager</h1>
        </div>

        <div className="flex flex-col flex-1 p-4 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
                ${location.pathname === item.path
                  ? "bg-[#727D73] text-white"
                  : "text-gray-600 hover:bg-[#727D73] hover:text-white"
                }`}
            >
              {item.icon}
              <span className="ml-3">{item.title}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-4 w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Logout
        </button>
      </nav>
      
    </>
  );
}

export default Sidebar;
