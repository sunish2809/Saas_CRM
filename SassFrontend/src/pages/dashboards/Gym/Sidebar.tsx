import { IoMdHome } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { IoMdList } from "react-icons/io";
import { IoMdAnalytics } from "react-icons/io";
import { IoMdSettings } from "react-icons/io";
import { IoMdLogOut } from "react-icons/io";
import { useAuth0 } from '@auth0/auth0-react';
interface SidebarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
  }
  
  const Sidebar = ({ 
    currentPage, 
    setCurrentPage, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
  }: SidebarProps) => {
    const navItems = [
      { id: 'home', label: 'Home', icon: IoMdHome },
      { id: 'add', label: 'Add', icon: IoMdAdd },
      { id: 'list', label: 'List', icon: IoMdList },
      { id: 'analytics', label: 'Analytics', icon: IoMdAnalytics },
    ];
  
    const bottomNavItems = [
      { id: 'settings', label: 'Settings', icon: 'SettingsIcon' },
      { id: 'logout', label: 'Logout', icon: 'LogoutIcon', className: 'text-red-400' },
    ];

    const {  logout } = useAuth0();
  
  
    return (
      <>
        {/* Desktop Sidebar */}
        <nav className="fixed top-0 left-0 h-screen w-64 bg-neutral-800 text-neutral-300 border-r border-neutral-700 lg:block hidden">
          <div className="p-4 border-b border-neutral-700">
            <h1 className="text-xl font-bold text-white">GYM MANAGER</h1>
          </div>
          
          <div className="py-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center px-4 py-3 transition-colors duration-200 ease-in-out hover:bg-neutral-700 ${
                  currentPage === item.id ? 'bg-neutral-700 text-white' : ''
                }`}
                onClick={() => setCurrentPage(item.id)}
              >
                <item.icon  className="mr-2"/>
                {item.label}
              </a>
            ))}
          </div>
          
          {/* Bottom Navigation */}
          <div className="absolute bottom-0 w-full border-t border-neutral-700">
            {bottomNavItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`flex items-center px-4 py-3 transition-colors duration-200 ease-in-out hover:bg-neutral-700 ${
                  item.className || ''
                }`}
                onClick={() => {
                  if (item.id === 'logout') {
                    logout({ logoutParams: { returnTo: window.location.origin } });
                  } else {
                    setCurrentPage(item.id);
                  }
                }}
              >
                {/* Using dynamic import for icons since they are strings */}
                <span className="mr-2">
                  {item.icon === 'SettingsIcon' && <IoMdSettings />}
                  {item.icon === 'LogoutIcon' && <IoMdLogOut />}
                </span>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
  
        {/* Mobile Menu Button and Overlay */}
        <button
          type="button"
          className="lg:hidden fixed top-4 left-4 z-50 rounded-lg bg-neutral-800 p-2 text-neutral-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {/* Add your menu icon here */}
        </button>
  
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-neutral-800/80 backdrop-blur-lg">
            {/* Mobile menu content */}
          </div>
        )}
      </>
    );
  };
  
  export default Sidebar;