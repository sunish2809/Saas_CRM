import { useEffect } from 'react';

interface InactivityWarningProps {
  timeRemaining: number; // in seconds
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

/**
 * Modal component to warn user about impending logout due to inactivity
 */
const InactivityWarning: React.FC<InactivityWarningProps> = ({
  timeRemaining,
  onStayLoggedIn,
  onLogout,
}) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Auto logout when time reaches 0
  useEffect(() => {
    if (timeRemaining === 0) {
      onLogout();
    }
  }, [timeRemaining, onLogout]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">
            Session Timeout Warning
          </h3>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            You have been inactive for a while. Your session will expire in:
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2 text-center">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Logout Now
          </button>
          <button
            onClick={onStayLoggedIn}
            className="px-4 py-2 text-sm font-medium text-white bg-[#727D73] rounded-md hover:bg-[#AAB99A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#727D73]"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
};

export default InactivityWarning;

