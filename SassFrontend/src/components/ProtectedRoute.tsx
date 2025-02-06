

import { Navigate } from 'react-router-dom';
// interface User {
//   businessType: string;
//   email: string;
//   name: string;
//   id: string;
// }

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredBusinessType: string;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  if (!token || !user ) {
    return <Navigate to="/get-started" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;