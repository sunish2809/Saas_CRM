// import { useAuth0 } from '@auth0/auth0-react';
// import { Navigate } from 'react-router-dom';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
// }

// function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { isAuthenticated, isLoading } = useAuth0();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/signin" replace />;
//   }

//   return <>{children}</>;
// }

// export default ProtectedRoute;

// import { useAuth0 } from '@auth0/auth0-react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { authService } from '../pages/authService';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   requiredBusinessType?: string;
// }

// function ProtectedRoute({ children, requiredBusinessType }: ProtectedRouteProps) {
//   const { isAuthenticated: isAuth0Authenticated, isLoading, user } = useAuth0();
//   const location = useLocation();

//   // Check JWT token from your backend
//   const token = authService.getToken();
//   const localUser = authService.getCurrentUser();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   // Not authenticated with either Auth0 or JWT
//   if (!isAuth0Authenticated || !token || !localUser) {
//     return <Navigate to="/get-started" replace state={{ from: location }} />;
//   }

//   // If business type is required, check if user has access
//   if (requiredBusinessType) {
//     const userBusinessType = localUser.businessType.toLowerCase();
//     if (userBusinessType !== requiredBusinessType.toLowerCase()) {
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   return <>{children}</>;
// }

// export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
interface User {
  businessType: string;
  email: string;
  name: string;
  id: string;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredBusinessType: string;
}

function ProtectedRoute({ children,requiredBusinessType }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  console.log("user",user);
  console.log("requiredBusinessType",requiredBusinessType);
  if (!token || !user ) {
    return <Navigate to="/get-started" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;