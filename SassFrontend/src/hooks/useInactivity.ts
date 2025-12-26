import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseInactivityOptions {
  timeoutMinutes?: number; // Default: 15 minutes
  warningMinutes?: number; // Show warning before logout (default: 2 minutes before)
  onLogout?: () => void;
}

/**
 * Custom hook to handle user inactivity and auto-logout
 * Tracks user activity (mouse, keyboard, clicks) and logs out after inactivity period
 */
export const useInactivity = ({
  timeoutMinutes = 15,
  warningMinutes = 2,
  onLogout,
}: UseInactivityOptions = {}) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const onLogoutRef = useRef(onLogout);

  // Keep onLogout ref updated
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearTimers();
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Call custom logout handler if provided
    if (onLogoutRef.current) {
      onLogoutRef.current();
    }
    
    // Redirect to login
    navigate('/get-started', { replace: true });
    
    // Show logout message
    alert('You have been logged out due to inactivity. Please sign in again.');
  }, [clearTimers, navigate]);

  const resetTimer = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    setTimeRemaining(0);

    const timeoutMs = timeoutMinutes * 60 * 1000; // Convert to milliseconds
    const warningMs = warningMinutes * 60 * 1000;
    const warningTime = timeoutMs - warningMs;

    // Set warning timer
    if (warningTime > 0) {
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(true);
        setTimeRemaining(warningMinutes * 60); // seconds
        
        // Update countdown
        countdownIntervalRef.current = setInterval(() => {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, warningTime);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(() => {
      logout();
    }, timeoutMs);
  }, [timeoutMinutes, warningMinutes, clearTimers, logout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleStayLoggedIn = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Only set up inactivity tracking if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      clearTimers();
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [handleActivity, resetTimer, clearTimers]);

  return {
    showWarning,
    timeRemaining,
    handleStayLoggedIn,
  };
};

