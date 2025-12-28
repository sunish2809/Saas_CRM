
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import axios from 'axios';
import BusinessTypeSwitcher from '../../../components/BusinessTypeSwitcher';

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: 'members',
    title: 'Members',
    path: '/dashboard/library/members',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 12H9m4 8H9m4 0a9 9 0 110 0m4-8a4 4 0 110-5.292M15 12H9" />
      </svg>
    ),
  },
  {
    id: 'add-member',
    title: 'Add Member',
    path: '/dashboard/library/add-member',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    title: 'Settings',
    path: '/dashboard/library/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setUserData(JSON.parse(userStr));
        } else if (token) {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/owner/get-owner`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setUserData(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Library</h1>
          <p className="text-sm text-gray-500 mt-1">Management System</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-600'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {userData?.name?.substring(0, 2).toUpperCase() || 'AU'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">{userData?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 truncate">{userData?.email || 'admin@library.com'}</p>
            </div>
          </div>
          {userData && userData.allBusinessTypes && userData.allBusinessTypes.length > 1 && (
            <div className="w-full">
              <BusinessTypeSwitcher
                currentBusinessType={userData.currentBusinessType || userData.businessType}
                allBusinessTypes={userData.allBusinessTypes}
                membershipType={userData.membershipType || 'None'}
              />
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-900">Library</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 px-2 py-3 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive(item.path)
                    ? 'bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-600'
                    : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </button>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
              {userData && userData.allBusinessTypes && userData.allBusinessTypes.length > 1 && (
                <div className="px-2">
                  <BusinessTypeSwitcher
                    currentBusinessType={userData.currentBusinessType || userData.businessType}
                    allBusinessTypes={userData.allBusinessTypes}
                    membershipType={userData.membershipType || 'None'}
                  />
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

export default Sidebar;