import { useAuth } from "../App";

const publicLinks  = [
  { label: "Home",    path: "/" },
  { label: "About",   path: "/about" },
  { label: "Jobs",    path: "/jobs" },
  { label: "Contact", path: "/contact" },
];
const privateLinks = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Work",      path: "/work" },
  { label: "Test",      path: "/test" },
  { label: "Earnings",  path: "/earnings" },
  { label: "Profile",   path: "/profile" },
];

export default function Navbar({ navigate, path }) {
  const { user, logout } = useAuth();
  const links = user ? privateLinks : publicLinks;

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate("/")}>
        <span className="brand-med">Med</span>
        <span className="brand-cyber">Cyber</span>
        <span className="brand-work">Work</span>
      </div>
      <div className="nav-links">
        {links.map((l) => (
          <button
            key={l.path}
            className={`nav-link ${path === l.path ? "active" : ""}`}
            onClick={() => navigate(l.path)}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn-outline" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn-primary" onClick={() => navigate("/register")}>Sign up</button>
          </>
        )}
      </div>
    </nav>
  );
}
