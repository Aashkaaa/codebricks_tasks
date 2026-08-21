import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAdminLoggedIn, adminUsername, logoutAdmin } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🧠 QuizApp
      </Link>
      <div className="navbar-links">
        <Link to="/">Play</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {isAdminLoggedIn ? (
          <>
            <Link to="/admin">Admin ({adminUsername})</Link>
            <button className="link-button" onClick={logoutAdmin}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/admin/login">Admin Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
