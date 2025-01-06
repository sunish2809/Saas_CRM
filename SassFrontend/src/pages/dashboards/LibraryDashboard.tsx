import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../../components/api';
import { useEffect, useState } from 'react';

function LibraryDashboard() {
  const { user, logout } = useAuth0();
  const api = useApi();
  const [data, setData] = useState(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await api.get('/library/data');
  //       setData(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch data:', error);
  //     }
  //   };

  //   fetchData();
  // }, [api]);

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