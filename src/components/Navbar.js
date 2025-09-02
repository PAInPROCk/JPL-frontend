import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";

axios.defaults.withCredentials = true;

const Navbar = () => {
  const [auth, setAuth] = useState({ authenticated: false, user: null, role: null });
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    axios
      .get("http://localhost:5000/check-auth")
      .then((res) => {
        setAuth({
          authenticated: res.data.authenticated,
          user: res.data.user,
          role: res.data.role,
        });
      })
      .catch(() => setAuth({ authenticated: false, user: null, role: null }));

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

  const handleLogout = () => {
    axios.post("http://localhost:5000/logout")
      .then(() => {
        setAuth({ authenticated: false, user: null, role: null });
        navigate("/login");
      });
  };

  return (
    <header ref={navRef}>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/home">
          <strong className="me-2">JPL</strong>
          <img
            src="/assets/images/cricket.png"
            alt="Player"
            width="37"
            height="37"
            className="me-1"
          />
        </Link>

        <button
          className={`navbar-toggler ${expanded ? "" : "collapsed"}`}
          type="button"
          onClick={handleToggle}
          aria-controls="navbarContent"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`} id="navbarContent">
          <ul className="navbar-nav ms-auto" onClick={handleClose}>

            {/* Teams, Players always visible */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/teams") ? "active" : ""}`} to="/teams">
                Teams
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/players") ? "active" : ""}`} to="/players">
                Players
              </Link>
            </li>

            {/* Registration always for all */}
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/register") ? "active" : ""}`} to="/register">
                Registration
              </Link>
            </li>

            {/* Auction: enabled if logged in, disabled for guest */}
            <li className="nav-item">
              {auth.authenticated ? (
                <Link className={`nav-link ${isActive("/Auction_rule") ? "active" : ""}`} to="/Auction_rule">
                  Auction
                </Link>
              ) : (
                <span className="nav-link disabled" style={{ color: "#aaa", cursor: "not-allowed" }}>
                  Auction
                </span>
              )}
            </li>

            {/* Admin: visible and enabled only for role 'admin' */}
            {auth.authenticated && auth.role === "admin" ? (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin">
                  Admin
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <span className="nav-link disabled" style={{ color: "#aaa", cursor: "not-allowed" }}>
                  Admin
                </span>
              </li>
            )}

            {/* Login or Logout */}
            {!auth.authenticated ? (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/login") ? "active" : ""}`} to="/login">
                  Login
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>
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
