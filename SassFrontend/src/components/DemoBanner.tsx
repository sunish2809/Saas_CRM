import { X, Info } from "lucide-react";
import { useState, useEffect } from "react";

interface DemoBannerProps {
  themeColor?: 'orange' | 'teal' | 'blue';
}

const DemoBanner: React.FC<DemoBannerProps> = ({ themeColor = 'orange' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDemo = localStorage.getItem("isDemoAccount") === "true";
    if (!isDemo) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("demo-banner-dismissed", "true");
  };

  useEffect(() => {
    const dismissed = localStorage.getItem("demo-banner-dismissed");
    if (dismissed === "true") {
      setIsVisible(false);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

  const themeClasses = {
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      icon: 'text-orange-600',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-900',
      icon: 'text-teal-600',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-900',
      icon: 'text-blue-600',
    }
  };

  const theme = themeClasses[themeColor];

  return (
    <div className={`${theme.bg} border-b ${theme.border}`}>
      <div className="flex items-center justify-between px-4 md:px-6 py-3 gap-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-3 flex-1">
          <Info className={`w-5 h-5 ${theme.icon} flex-shrink-0`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${theme.text}`}>
              <strong>Demo Account:</strong> You're viewing a demo account with sample data. 
              Changes won't be saved. <a href="/get-started" className="underline font-semibold">Create your account</a> to get started.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className={`p-2 ${theme.text} hover:opacity-70 rounded-lg transition-colors`}
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DemoBanner;

