import { useState, createContext, useContext, useEffect } from "react";
import Home      from "./pages/Home";
import About     from "./pages/About";
import Jobs      from "./pages/Jobs";
import Contact   from "./pages/Contact";
import Login     from "./pages/Login";
import Register  from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Test      from "./pages/Test";
import Work      from "./pages/Work";
import Earnings  from "./pages/Earnings";
import Profile   from "./pages/Profile";
import Navbar    from "./components/Navbar";

export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function useRoute() {
  const [path, setPath] = useState(window.location.hash.slice(1) || "/");
  const navigate = (to) => { window.location.hash = to; setPath(to); };
  // keep in sync if user presses back/forward
  useEffect(() => {
    const handler = () => setPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return { path, navigate };
}

function PrivateRoute({ children, navigate }) {
  const { user } = useAuth();
  useEffect(() => { if (!user) navigate("/login"); }, [user]);
  if (!user) return null;
  return children;
}

export default function App() {
  // Restore session from localStorage on first load
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mcw_user")); } catch { return null; }
  });
  const { path, navigate } = useRoute();

  const login = ({ token, user }) => {
    localStorage.setItem("mcw_token", token);
    localStorage.setItem("mcw_user",  JSON.stringify(user));
    setUser(user);
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("mcw_token");
    localStorage.removeItem("mcw_user");
    setUser(null);
    navigate("/");
  };

  const pages = {
    "/":          <Home navigate={navigate} />,
    "/about":     <About navigate={navigate} />,
    "/jobs":      <Jobs navigate={navigate} />,
    "/contact":   <Contact />,
    "/login":     <Login />,
    "/register":  <Register />,
    "/dashboard": <PrivateRoute navigate={navigate}><Dashboard navigate={navigate} /></PrivateRoute>,
    "/test":      <PrivateRoute navigate={navigate}><Test navigate={navigate} /></PrivateRoute>,
    "/work":      <PrivateRoute navigate={navigate}><Work navigate={navigate} /></PrivateRoute>,
    "/earnings":  <PrivateRoute navigate={navigate}><Earnings /></PrivateRoute>,
    "/profile":   <PrivateRoute navigate={navigate}><Profile /></PrivateRoute>,
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Navbar navigate={navigate} path={path} />
      <main className="page-content">
        {pages[path] ?? (
          <div className="not-found">
            <h1>404</h1>
            <p>Page not found.</p>
            <button onClick={() => navigate("/")}>Go home</button>
          </div>
        )}
      </main>
    </AuthContext.Provider>
  );
}
