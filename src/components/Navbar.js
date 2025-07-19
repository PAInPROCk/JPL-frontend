import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const navRef = useRef();

  const handleToggle = () => setExpanded((prev) => !prev);
  const handleClose = () => setExpanded(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (expanded && navRef.current && !navRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

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
            <li className="nav-item">
              <Link className="nav-link" to="/teams">Teams</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/players">Players</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Auction_rule">Auction</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">Admin</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">Registration</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default NavbarComponent;
