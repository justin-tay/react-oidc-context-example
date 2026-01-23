const KEYCLOAK_ADMIN = process.env.KEYCLOAK_ADMIN ?? 'admin';
const KEYCLOAK_ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD ?? 'admin';
const KEYCLOAK_SERVER = process.env.KEYCLOAK_SERVER ?? 'http://localhost:8080';
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM ?? 'test';
const KEYCLOAK_CLIENT =
  process.env.KEYCLOAK_CLIENT ?? 'react-oidc-context-example';

const credentials = async ({ server, user, password }) => {
  const response = await fetch(
    `${server}/realms/master/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: user,
        password,
        grant_type: 'password',
        client_id: 'admin-cli',
      }),
    }
  );
  const token = await response.json();
  if (token.error_description) {
    throw new Error(token.error_description);
  }
  return token.access_token;
};

const setup = async () => {
  const bearer = await credentials({
    server: KEYCLOAK_SERVER,
    user: KEYCLOAK_ADMIN,
    password: KEYCLOAK_ADMIN_PASSWORD,
  });
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${bearer}`,
  };
  // Create realm
  console.info(`Creating realm '${KEYCLOAK_REALM}'`);
  let response = await fetch(`${KEYCLOAK_SERVER}/admin/realms`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      enabled: true,
      realm: KEYCLOAK_REALM,
      registrationAllowed: true,
    }),
  });
  let json = null;
  if (response.status !== 201) {
    json = await response.json();
    console.error(
      `Failed to create realm '${KEYCLOAK_REALM}': ${json.errorMessage}`
    );
  } else {
    console.info(`Created realm '${KEYCLOAK_REALM}'`);
  }
  // Create client
  console.info(`Creating client '${KEYCLOAK_CLIENT}'`);
  response = await fetch(
    `${KEYCLOAK_SERVER}/admin/realms/${KEYCLOAK_REALM}/clients`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        attributes: {
          'pkce.code.challenge.method': 'S256',
          'post.logout.redirect.uris': 'http://localhost:5173/*##http://localhost:4173/*',
        },
        clientId: KEYCLOAK_CLIENT,
        description: '',
        directAccessGrantsEnabled: false,
        frontchannelLogout: true,
        implicitFlowEnabled: false,
        name: '',
        protocol: 'openid-connect',
        publicClient: true,
        redirectUris: ['http://localhost:5173/*','http://localhost:4173/*'],
        rootUrl: '',
        serviceAccountsEnabled: false,
        standardFlowEnabled: true,
        webOrigins: ['http://localhost:5173','http://localhost:4173'],
      }),
    }
  );
  if (response.status !== 201) {
    json = await response.json();
    console.error(
      `Failed to create client '${KEYCLOAK_CLIENT}': ${json.errorMessage}`
    );
  } else {
    console.info(`Created client '${KEYCLOAK_CLIENT}'`);
  }
};

setup()
  .catch((err) => console.error(err.message ?? err))
  .finally(() => console.info('Setup complete'));
