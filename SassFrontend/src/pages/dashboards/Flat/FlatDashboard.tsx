import { useAuth0 } from '@auth0/auth0-react';

function FlatDashboard() {
  const { logout } = useAuth0();

  return (
    <div>
      <header>
        <h1>Library Management Dashboard</h1>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Logout
        </button>
      </header>
      <nav>
      </nav>
      <main>
      </main>
    </div>
  );
}

export default FlatDashboard;