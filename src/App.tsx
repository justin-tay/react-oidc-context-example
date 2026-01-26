import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { useAuth } from "react-oidc-context";
import "./App.css";
import { useSessionStorage } from "./useSessionStorage";
import { Link, Route, Routes } from "react-router-dom";

function Home() {
  const [count, setCount] = useSessionStorage("count", 0);

  return (
    <>
      <h2>Home Page</h2>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
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
function About() {
  return <h2>About Page</h2>;
}
function Contact() {
  return <h2>Contact Page</h2>;
}

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/" className="nav-link">
              Home
            </Link>{" "}
            <Link to="/about" className="nav-link">
              About
            </Link>{" "}
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>
          <div className="nav-right">
            <div className="nav-link">Hello, {auth.user?.profile.name}!<button onClick={() => void auth.signoutRedirect()}>Log out</button></div>
            
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </>
    );
  }

  return <button onClick={() => 
    void auth.signinRedirect()
  }>Log in</button>;
}

export default App;
