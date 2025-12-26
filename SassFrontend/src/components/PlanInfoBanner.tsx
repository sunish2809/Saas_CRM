import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Info, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface PlanInfoBannerProps {
  membershipType: string;
  allBusinessTypes: string[];
  currentBusinessType: string;
  themeColor?: 'orange' | 'teal' | 'blue';
}

const PlanInfoBanner: React.FC<PlanInfoBannerProps> = ({
  membershipType,
  allBusinessTypes,
  currentBusinessType,
  themeColor = 'orange'
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  // Check if dismissed in localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem(`plan-banner-dismissed-${membershipType}`);
    if (dismissed === 'true') {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, [membershipType]);

  // Treat "None" as Starter plan
  const displayMembershipType = membershipType === "None" || !membershipType ? "Starter" : membershipType;
  const isStarter = displayMembershipType === "Starter";
  const canAccessAll = displayMembershipType === "Professional" || 
                       displayMembershipType === "Enterprise" || 
                       displayMembershipType === "Lifetime";

  const themeClasses = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700',
      buttonText: 'text-white'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
      icon: 'text-teal-600',
      button: 'bg-teal-600 hover:bg-teal-700',
      buttonText: 'text-white'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      buttonText: 'text-white'
    }
  };

  const theme = themeClasses[themeColor];

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`plan-banner-dismissed-${membershipType}`, 'true');
    setIsDismissed(true);
  };

  if (!isVisible || isDismissed) {
    return null;
  }

  return (
    <div className={`${theme.bg} border-b ${theme.border}`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3 flex-1">
          {isStarter ? (
            <AlertCircle className={`w-5 h-5 ${theme.icon} flex-shrink-0`} />
          ) : (
            <Info className={`w-5 h-5 ${theme.icon} flex-shrink-0`} />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${theme.text}`}>
              {isStarter ? (
                <>
                  You're on the <strong>{displayMembershipType} Plan</strong>. You can access <strong>1 business type</strong> ({currentBusinessType}). 
                  {allBusinessTypes.length >= 1 && ' Upgrade to access Gym and Library management systems.'}
                </>
              ) : canAccessAll ? (
                <>
                  You're on the <strong>{displayMembershipType} Plan</strong>. You have access to all business types.
                </>
              ) : (
                <>
                  You're on the <strong>{displayMembershipType} Plan</strong>. You can access {allBusinessTypes.length} business type(s).
                </>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isStarter && (
            <button
              onClick={() => navigate("/pricing")}
              className={`px-4 py-2 ${theme.button} ${theme.buttonText} rounded-lg text-sm font-medium transition-colors whitespace-nowrap`}
            >
              Upgrade Plan
            </button>
          )}
          <button
            onClick={handleDismiss}
            className={`p-2 ${theme.text} hover:opacity-70 rounded-lg transition-colors`}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanInfoBanner;

