import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface BusinessTypeSwitcherProps {
  currentBusinessType: string;
  allBusinessTypes: string[];
  membershipType: string;
  onSwitch?: (businessType: string) => void;
}

const BusinessTypeSwitcher: React.FC<BusinessTypeSwitcherProps> = ({
  currentBusinessType,
  allBusinessTypes,
  membershipType,
  onSwitch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const businessTypeLabels: { [key: string]: string } = {
    GYM: 'Gym',
    LIBRARY: 'Library',
    HARDWARE: 'Product'
  };

  const businessTypeColors: { [key: string]: string } = {
    GYM: 'orange',
    LIBRARY: 'teal',
    HARDWARE: 'blue'
  };

  const handleSwitch = async (businessType: string) => {
    if (businessType === currentBusinessType) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/owner/switch-business-type`,
        { businessType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update token and user data from response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } else {
        // Fallback: Update localStorage manually if user data not in response
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          userData.businessType = businessType.toUpperCase();
          userData.currentBusinessType = businessType.toUpperCase();
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }

      // Navigate to the new dashboard
      navigate(`/dashboard/${businessType.toLowerCase()}`);
      
      if (onSwitch) {
        onSwitch(businessType);
      }
      
      setIsOpen(false);
      // Reload to refresh all data with new token
      window.location.reload();
    } catch (error: any) {
      console.error('Error switching business type:', error);
      alert(error.response?.data?.message || 'Failed to switch business type');
    } finally {
      setLoading(false);
    }
  };

  const canAccessAll = membershipType === 'Professional' || 
                       membershipType === 'Enterprise' || 
                       membershipType === 'Lifetime';

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
          currentBusinessType === 'GYM' 
            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
            : currentBusinessType === 'LIBRARY'
            ? 'bg-teal-100 text-teal-700 hover:bg-teal-200'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span>{businessTypeLabels[currentBusinessType] || currentBusinessType}</span>
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 mt-2 w-full bg-white rounded-lg shadow-lg z-20 border border-gray-200">
            <div className="py-1">
              {allBusinessTypes.map((type) => {
                const isActive = type === currentBusinessType;
                return (
                  <button
                    key={type}
                    onClick={() => handleSwitch(type)}
                    disabled={loading || isActive}
                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                      isActive
                        ? type === 'GYM'
                          ? 'bg-orange-50 text-orange-700 font-medium'
                          : type === 'LIBRARY'
                          ? 'bg-teal-50 text-teal-700 font-medium'
                          : 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    } ${loading || isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{businessTypeLabels[type] || type}</span>
                      {isActive && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
              
              {!canAccessAll && allBusinessTypes.length < 2 && (
                <div className="border-t border-gray-200 mt-1 pt-1">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Upgrade to access all business types
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessTypeSwitcher;

