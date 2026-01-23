import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { useAuth } from "react-oidc-context";
import "./App.css";
import { useSessionStorage } from "./useSessionStorage";

function App() {
  const auth = useAuth();

  const [count, setCount] = useSessionStorage('count', 0)

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <div>
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <div>
          <p>Hello, {auth.user?.profile.name}!</p>
          <button onClick={() => void auth.signoutRedirect()}>Log out</button>
        </div>
        <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      </>
    );
  }

  return <button onClick={() => void auth.signinRedirect()}>Log in</button>;
}

export default App;
