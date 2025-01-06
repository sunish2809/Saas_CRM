import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom'; // Make sure this import exists
import './index.css';
import App from './App.tsx';

const domain = 'dev-ocykrhgzm4vioxkl.us.auth0.com';
const clientId = 'Ti1rLwL2NM3FxuV5y54W90iwnx7dBUbC';
const redirectUri = window.location.origin;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
        }}
        cacheLocation='localstorage'
      >
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </StrictMode>,
);

