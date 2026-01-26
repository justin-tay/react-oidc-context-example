import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider, type AuthProviderProps } from "react-oidc-context";
import { BrowserRouter } from "react-router-dom";

import { Log } from 'oidc-client-ts';
Log.setLogger(console);
Log.setLevel(Log.DEBUG);

const issuer = "http://localhost:8080/realms/test";

const oidcConfig: AuthProviderProps = {
  authority: issuer,
  client_id: "react-oidc-context-example",
  redirect_uri: window.location.origin + window.location.pathname + window.location.hash,
  onSigninCallback: () => {
    // Clear the auth code parameters from the URL after login
    window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
  },
  post_logout_redirect_uri: window.location.origin, // Ask keycloak to redirect back to app after logout instead of displaying the keycloak logout page
  metadata: { // Define meta data manually instead of requiring a call to the keycloak discovery endpoint
    issuer,
    authorization_endpoint: `${issuer}/protocol/openid-connect/auth`,
    token_endpoint: `${issuer}/protocol/openid-connect/token`,
    userinfo_endpoint: `${issuer}/protocol/openid-connect/userinfo`,
    end_session_endpoint: `${issuer}/protocol/openid-connect/logout`,
    jwks_uri: `${issuer}/protocol/openid-connect/certs`,
  }
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
