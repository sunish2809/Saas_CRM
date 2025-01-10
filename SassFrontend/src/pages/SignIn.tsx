import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BusinessType, BUSINESS_OPTIONS }from '../components/business';

function SignIn() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const businessType = searchParams.get('business') as BusinessType;

  useEffect(() => {
    if (!businessType || !BUSINESS_OPTIONS.find(b => b.id === businessType)) {
      navigate('/get-started'); // Redirect to home if no valid business type
      return;
    }

    if (isAuthenticated) {
      navigate(`/dashboard/${businessType.toLowerCase()}`);
    } else {
      loginWithRedirect({
        appState: { businessType }, // Store business type in Auth0 state
      });
    }
  }, [isAuthenticated, loginWithRedirect, navigate, businessType]);

  return (
    <div>
      <p>Redirecting to sign in...</p>
    </div>
  );
}

export default SignIn;