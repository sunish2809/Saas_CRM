// import { useAuth0 } from '@auth0/auth0-react';
// import { useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { BusinessType, BUSINESS_OPTIONS } from '../components/business';

// function SignUp() {
//   const { loginWithRedirect, isAuthenticated, user, isLoading } = useAuth0();
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const businessType = searchParams.get('business') as BusinessType;

//   useEffect(() => {
//     const handleAuth = async () => {
//       // Wait for Auth0 to finish loading
//       if (isLoading) return;

//       if (!businessType || !BUSINESS_OPTIONS.find(b => b.id === businessType)) {
//         navigate('/get-started');
//         return;
//       }

//       if (isAuthenticated && user) {
//         // Get business type from user metadata
//         const userBusinessType = user['https://your-domain.com/business_type'];
        
//         if (userBusinessType) {
//           // Existing user - redirect to their dashboard
//           navigate(`/dashboard/${userBusinessType.toLowerCase()}`);
//         } else {
//           // New user - redirect to selected business type dashboard
//           navigate(`/dashboard/${businessType.toLowerCase()}`);
//         }
//       } else if (!isAuthenticated && !isLoading) {
//         // Not authenticated - proceed with signup
//         loginWithRedirect({
//           authorizationParams: {
//             screen_hint: 'signup',
//           },
//           appState: { 
//             returnTo: `/dashboard/${businessType.toLowerCase()}`,
//             businessType 
//           },
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
//       <p className="text-lg">Redirecting to sign up...</p>
//     </div>
//   );
// }

// export default SignUp;


// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { authService } from './authService';

// function SignUp() {
//   const navigate = useNavigate();
//   const { businessType } = useParams<{ businessType: string }>();
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//   });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await authService.signUp({
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
//             Create your account
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
//                 type="text"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
//                 placeholder="Full name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//               />
//             </div>
//             <div>
//               <input
//                 type="email"
//                 required
//                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
//               {loading ? 'Creating account...' : 'Sign up'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignUp;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const SignUp: React.FC = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     businessType: 'LIBRARY', // Default business type
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
//       if (response.status === 201) {
//         // Redirect to sign-in or dashboard after successful signup
//         navigate('/signin');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
//         <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//           required
//         />
//         <select
//           name="businessType"
//           value={formData.businessType}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//         >
//           <option value="LIBRARY">Library</option>
//           <option value="GYM">Gym</option>
//           <option value="FLAT">Flat</option>
//         </select>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;


// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const SignUp: React.FC = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     businessType: 'LIBRARY', // Default business type, will be updated from URL
//   });

//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Retrieve the business type from the URL query parameter
//     const queryParams = new URLSearchParams(location.search);
//     const business = queryParams.get('business');
//     if (business) {
//       setFormData((prevData) => ({ ...prevData, businessType: business }));
//     }
//   }, [location.search]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
//       if (response.status === 201) {
//         // Redirect to sign-in or dashboard after successful signup
//         navigate(`/signip?business=${formData.businessType}`)
//         //navigate('/signin');
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg">
//         <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
//         {error && <p className="text-red-500">{error}</p>}
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//           required
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//           required
//         />
//         <select
//           name="businessType"
//           value={formData.businessType}
//           onChange={handleInputChange}
//           className="border p-2 mb-4 w-full"
//         >
//           <option value="LIBRARY">LIBRARY</option>
//           <option value="GYM">GYM</option>
//           <option value="FLAT">FLAT</option>
//         </select>
//         <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full">
//           Sign Up
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignUp;


import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/util";
import { BsJustify } from 'react-icons/bs';

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    businessType: 'LIBRARY', // Default business type, will be updated from URL
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Retrieve the business type from the URL query parameter
    const queryParams = new URLSearchParams(location.search);
    const business = queryParams.get('business');
    if (business) {
      setFormData((prevData) => ({ ...prevData, businessType: business }));
    }
  }, [location.search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/signup', formData);
      if (response.status === 201) {
        navigate(`/signin?business=${formData.businessType}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

//   return (
//     <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8">
//     <div className="max-w-md w-full mx-auto  rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black"
// >
//       <h2 className="font-bold text-xl text-white-800 text-white-200"
//       style={{color: 'white'}}>
//         Welcome to Your Platform
//       </h2>
//       <p className="text-neutral-600 text-sm max-w-sm mt-2 text-white-300"
//       style={{color: 'white'}}>
//         Sign up to get started with your {formData.businessType} management journey.
//       </p>

//       <form className="my-8" onSubmit={handleSubmit}>
//         <LabelInputContainer>
//           <Label style={{color: 'white'}} htmlFor="name">Name</Label>
//           <Input
//             id="name"
//             name="name"
//             placeholder="John Doe"
//             type="text"
//             value={formData.name}
//             onChange={handleInputChange}
//             required
//           />
//         </LabelInputContainer>
//         <LabelInputContainer className='my-2' >
//           <Label style={{color: 'white'}} htmlFor="email">Email Address</Label>
//           <Input
//             id="email"
//             name="email"
//             placeholder="example@domain.com"
//             type="email"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </LabelInputContainer>
//         <LabelInputContainer className='my-2'>
//           <Label style={{color: 'white'}} htmlFor="password">Password</Label>
//           <Input
//             id="password"
//             name="password"
//             placeholder="••••••••"
//             type="password"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />
//         </LabelInputContainer>
//         <LabelInputContainer className='my-2'>
//           <Label style={{color: 'white'}} htmlFor="businessType">Business Type</Label>
//           <select
//             id="businessType"
//             name="businessType"
//             value={formData.businessType}
//             onChange={handleInputChange}
//             className="border p-2 rounded-md w-full"
//           >
//             <option value="LIBRARY">LIBRARY</option>
//             <option value="GYM">GYM</option>
//             <option value="FLAT">FLAT</option>
//           </select>
//         </LabelInputContainer>

//         <button
//           className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
//           type="submit"
//         >
//           Sign Up &rarr;
//           <BottomGradient />
//         </button>

//         {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
//       </form>
//     </div>
//     </div>
//   );

return (
  <div className="w-full z-50 bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center bg-[url('https://mydukaan.io/_next/static/media/banner-home-main.ebd707dd321420dd97b2e08e0aa39020.webp')]">
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to get started with your {formData.businessType} management journey.
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="example@domain.com"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              placeholder="••••••••"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
              Business Type
            </label>
            <select
              id="businessType"
              name="businessType"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            >
              <option value="LIBRARY">LIBRARY</option>
              <option value="GYM">GYM</option>
              <option value="FLAT">FLAT</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group/btn relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
                Signing up...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default SignUp;




