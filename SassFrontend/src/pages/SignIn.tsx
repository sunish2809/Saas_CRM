// import { useAuth0 } from '@auth0/auth0-react';
// import { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { BusinessType, BUSINESS_OPTIONS } from '../components/business';

// function SignIn() {
//   const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const businessType = searchParams.get('business') as BusinessType;


//   useEffect(() => {
//     const handleAuth = async () => {
//       // Wait for Auth0 to finish loading
//       if (isLoading) return;
//       console.log(user);
//       console.log(isAuthenticated);
//       console.log(businessType);

//       console.log(isAuthenticated && user);


//       if (isAuthenticated && user) {
//         // Get business type from user metadata
//         const userBusinessType = user['https://dev-ocykrhgzm4vioxkl.us.auth0.com/business_type'];
//         console.log("userBusinessType",userBusinessType);
//         if (userBusinessType) {
//           // User has a business type, redirect to their dashboard
//           navigate(`/dashboard/${userBusinessType.toLowerCase()}`);
//         } else if (businessType && BUSINESS_OPTIONS.find(b => b.id === businessType)) {
//           // New user with selected business type
//           navigate(`/dashboard/${businessType.toLowerCase()}`);
//         } else {
//           // No business type - redirect to get started
//           navigate('/get-started');
//         }
//       } else if (!isAuthenticated && !isLoading) {
//         // Not authenticated - proceed with login
//         loginWithRedirect({
//           appState: { returnTo: window.location.pathname },
//         });
//       }
//     };

//     handleAuth();
//   }, [isAuthenticated, isLoading, user, loginWithRedirect, navigate, businessType]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <p className="text-lg">Redirecting to sign in...</p>
//     </div>
//   );
// }

// export default SignIn;

// import { useAuth0 } from "@auth0/auth0-react";
// import { useEffect } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { BusinessType, BUSINESS_OPTIONS, BusinessOption } from "../components/business";

// function SignIn() {
//   const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const businessType = (searchParams.get("business") as BusinessType ) ;

//   useEffect(() => {
//     if (isLoading) return;
//     if (isAuthenticated && user) {
//       const dashboardRoute = `/dashboard/${businessType.toLowerCase()}`;
//       navigate(dashboardRoute, { replace: true });
//     }
//   }, [isAuthenticated, user, businessType, navigate, isLoading]);

//   const handleLogin = async () => {
//     try {
//       await loginWithRedirect();
//     } catch (error) {
//       console.error("Login failed", error);
//     }
//   };

//   return (
//     <div className="signin-container">
//       <h1>Sign In</h1>
//       <button onClick={handleLogin} className="btn-primary">
//         Sign In with Auth0
//       </button>
//     </div>
//   );
// }

// export default SignIn;


// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { authService } from './authService';

// function SignIn() {
//   const navigate = useNavigate();
//   const { businessType } = useParams<{ businessType: string }>();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await authService.signIn({
//         ...formData,
//         businessType: businessType?.toUpperCase() || '',
//       });

//       // Navigate to appropriate dashboard
//       navigate(`/dashboard/${businessType?.toLowerCase()}`);
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'An error occurred');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           {error && (
//             <div className="rounded-md bg-red-50 p-4">
//               <div className="text-sm text-red-700">{error}</div>
//             </div>
//           )}
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <input
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//             >
//               {loading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignIn;

// import { useAuth0 } from '@auth0/auth0-react';
// import { useEffect } from 'react';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { BusinessType } from '../types/business';

// function SignIn() {
//   const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
//   const navigate = useNavigate();
//   const { businessType: pathBusinessType } = useParams<{ businessType?: string }>();
//   const [searchParams] = useSearchParams();
//   const queryBusinessType = searchParams.get('business');
  
//   // Use either path param or query param
//   const businessType = (pathBusinessType || queryBusinessType) as BusinessType;

//   useEffect(() => {
//     const handleAuth = async () => {
//       if (isLoading) return;

//       if (!businessType) {
//         navigate('/get-started');
//         return;
//       }

//       if (isAuthenticated) {
//         navigate(`/dashboard/${businessType.toLowerCase()}`);
//       } else {
//         loginWithRedirect({
//           appState: { 
//             returnTo: `/dashboard/${businessType.toLowerCase()}`,
//             businessType 
//           },
//         });
//       }
//     };

//     handleAuth();
//   }, [isAuthenticated, isLoading, businessType, loginWithRedirect, navigate]);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <p className="text-lg">Redirecting to sign in...</p>
//     </div>
//   );
// }

// export default SignIn;

// import { useState } from 'react';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import axios from 'axios';
// import api from '../components/api';
// function SignIn() {
//   const navigate = useNavigate();
//   const { businessType: pathBusinessType } = useParams<{ businessType?: string }>();
//   const [searchParams] = useSearchParams();
//   const queryBusinessType = searchParams.get('business');
  
//   // Use either path param or query param
//   const businessType = (pathBusinessType || queryBusinessType)?.toUpperCase();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });

//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

// // Update the handleSubmit function to use the api service


// // ... rest of the imports

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setError('');
//   setLoading(true);

//   try {
//     const response = await api.post('/auth/signin', {
//       email: formData.email,
//       password: formData.password,
//       businessType: businessType
//     });

//     localStorage.setItem('token', response.data.token);
//     localStorage.setItem('user', JSON.stringify(response.data.user));

//     navigate(`/dashboard/${businessType?.toLowerCase()}`);
//   } catch (err: any) {
//     console.error('SignIn error:', err);
//     setError(err.response?.data?.message || 'An error occurred during sign in');
//   } finally {
//     setLoading(false);
//   }
// };

//   // Redirect if no business type
//   if (!businessType) {
//     navigate('/get-started');
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             {businessType} Management System
//           </p>
//         </div>

//         {error && (
//           <div className="rounded-md bg-red-50 p-4">
//             <div className="text-sm text-red-700">{error}</div>
//           </div>
//         )}

//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="rounded-md shadow-sm -space-y-px">
//             <div>
//               <label htmlFor="email" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Email address"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               />
//             </div>
//             <div>
//               <label htmlFor="password" className="sr-only">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 autoComplete="current-password"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
//             >
//               {loading ? (
//                 <span className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 'Sign in'
//               )}
//             </button>
//           </div>

//           <div className="flex items-center justify-center">
//             <div className="text-sm">
//               <button
//                 type="button"
//                 onClick={() => navigate(`/signup?business=${businessType}`)}
//                 className="font-medium text-indigo-600 hover:text-indigo-500"
//               >

//                 Don't have an account? Sign up
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignIn;

import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from '../components/api';

function SignIn() {
  const navigate = useNavigate();
  const { businessType: pathBusinessType } = useParams<{ businessType?: string }>();
  const [searchParams] = useSearchParams();
  const queryBusinessType = searchParams.get('business');

  const businessType = (pathBusinessType || queryBusinessType)?.toUpperCase();
  console.log("businessType",businessType);
  console.log(businessType);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signin', {
        email: formData.email,
        password: formData.password,
        businessType: businessType,
      });

      localStorage.setItem('token', response.data.token);
      console.log("token",response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      console.log("code is here")

      navigate(`/dashboard/${businessType?.toLowerCase()}`);
    } catch (err: any) {
      console.error('SignIn error:', err);
      setError(err.response?.data?.message || 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  if (!businessType) {
    navigate('/get-started');
    return null;
  }

  return (
    <div className="w-full z-50 bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center bg-[url('https://mydukaan.io/_next/static/media/banner-home-main.ebd707dd321420dd97b2e08e0aa39020.webp')] ">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            {businessType} Management System
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-100 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate(`/signup?business=${businessType}`)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
