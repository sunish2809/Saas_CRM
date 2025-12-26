import { Navigate } from 'react-router-dom';
import { useInactivity } from '../hooks/useInactivity';
import InactivityWarning from './InactivityWarning';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredBusinessType: string;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/get-started';
  };
  
  // Inactivity tracking - 15 minutes timeout with 2 minute warning
  const { showWarning, timeRemaining, handleStayLoggedIn } = useInactivity({
    timeoutMinutes: 15, // Auto logout after 15 minutes of inactivity
    warningMinutes: 2,  // Show warning 2 minutes before logout
    onLogout: handleLogout,
  });

  if (!token || !user) {
    return <Navigate to="/get-started" />;
  }

  return (
    <>
      {children}
      {showWarning && (
        <InactivityWarning
          timeRemaining={timeRemaining}
          onStayLoggedIn={handleStayLoggedIn}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

export default ProtectedRoute;