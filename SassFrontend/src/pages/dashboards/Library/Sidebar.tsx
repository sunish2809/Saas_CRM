import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  id: string;
  title: string;
  icon: JSX.Element;
  path: string;
}


const navigationItems: NavItem[] = [
  {
    id: 'analytics',
    title: 'Analytics',
    path: '/dashboard/library/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
        />
      </svg>
    ),
  },
  {
    id: 'members',
    title: 'Members',
    path: '/dashboard/library/members',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
        />
      </svg>
    ),
  },
  {
    id: 'add-member',
    title: 'Add Member',
    path: '/dashboard/library/add-member',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" 
        />
      </svg>
    ),
  },

  {
    id: 'settings',
    title: 'Settings',
    path: '/dashboard/library/settings',
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
    // Remove setCurrentView as we'll use the URL path instead
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex flex-col w-64 h-screen bg-[#D0DDD0] border-r border-gray-200 fixed">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-[#727D73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
              />
            </svg>
            <h1 className="ml-2 text-xl font-bold text-[#727D73]">Library System</h1>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col flex-1 p-4 space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200
              ${location.pathname === item.path
                ? 'bg-[#727D73] text-white'
                : 'text-gray-600 hover:bg-[#727D73] hover:text-white'
              }`}
          >
            {item.icon}
            <span className="ml-3">{item.title}</span>
          </button>
        ))}
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <img
              src="https://avatar.iran.liara.run/public"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
            </div>
          </div>
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
        </div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 right-4 z-20 p-2 rounded-lg bg-white border border-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-10 bg-gray-900 bg-opacity-50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" 
                  />
                </svg>
                <h1 className="ml-2 text-xl font-bold text-indigo-600">Library System</h1>
              </div>
            </div>

            <div className="p-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-4 py-2 rounded-lg transition-colors duration-200 mb-1
                    ${location.pathname === item.path
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </button>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <img
                  src="https://avatar.iran.liara.run/public"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-[#727D73]">Admin User</p>
                  <p className="text-xs text-gray-500">admin@library.com</p>
                </div>
              </div>
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;

