import { useAuth0 } from '@auth0/auth0-react';
//import { useApi } from '../../../components/api';


function LibraryDashboard() {
  const { user, logout } = useAuth0();



  return (
    <div>
      <header>
        <h1>Library Dashboard</h1>
        <div>
          <span>Welcome, {user?.name}</span>
          <button onClick={() => logout({ 
            logoutParams: { returnTo: window.location.origin } 
          })}>
            Logout
          </button>
        </div>
      </header>
      {/* Dashboard content */}
    </div>
  );
}

export default LibraryDashboard;