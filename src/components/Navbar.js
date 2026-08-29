import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expanded && navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  const handleToggle = () => setExpanded((prev) => !prev);
  const handleClose = () => setExpanded(false);

  const handleLogout = async () => {
    await logout();           // ✅ context handles state
    handleClose();
    navigate("/login");       // ✅ redirect
  };
  console.log("Auth State:", { isAuthenticated, role });
  return (
    <header ref={navRef}>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <strong className="me-2">JPL</strong>
          <img
            src="/assets/images/cricket.png"
            alt="JPL Logo"
            width="37"
            height="37"
            className="me-1"
          />
        </Link>

        <button
          className={`navbar-toggler ${expanded ? "" : "collapsed"}`}
          type="button"
          onClick={handleToggle}
          aria-label="Toggle navigation"
          aria-expanded={expanded}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/teams") ? "active" : ""}`} to="/teams" onClick={handleClose}>
                Teams
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/players") ? "active" : ""}`} to="/players" onClick={handleClose}>
                Players
              </Link>
            </li>

            <li className="nav-item">
              <Link className={`nav-link ${isActive("/register") ? "active" : ""}`} to="/register" onClick={handleClose}>
                Registration
              </Link>
            </li>

            {/* Auction */}
            <li className="nav-item">
              {isAuthenticated ? (
                <Link className={`nav-link ${isActive("/Auction_rule") ? "active" : ""}`} to="/Auction_rule" onClick={handleClose}>
                  Auction
                </Link>
              ) : (
                <span className="nav-link disabled">Auction</span>
              )}
            </li>

            {/* Admin */}
            {isAuthenticated && role === "admin" && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin" onClick={handleClose}>
                  Admin
                </Link>
              </li>
            )}

            {/* Login / Logout */}
            {!isAuthenticated ? (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login" onClick={handleClose}>
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button type="button" className="btn btn-link nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
