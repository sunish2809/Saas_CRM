import { useAuth0 } from '@auth0/auth0-react';

function FlatDashboard() {
  //const { user, logout } = useAuth0();
  const {  logout } = useAuth0();

  return (
    <div>
      <header>
        <h1>Library Management Dashboard</h1>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Logout
        </button>
      </header>
      <nav>
        {/* Add your navigation menu here */}
      </nav>
      <main>
        {/* Add your dashboard content here */}
      </main>
    </div>
  );
}

export default FlatDashboard;