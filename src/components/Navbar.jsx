
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/navbar.scss";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();

  const profilePath =
    currentUser?.role === "owner"
      ? "/owner/profile"
      : currentUser?.role === "admin"
      ? "/admin/profile"
      : "/profile";

  const dashboardPath =
    currentUser?.role === "owner"
      ? "/owner/dashboard"
      : currentUser?.role === "admin"
      ? "/admin/dashboard"
      : "/my-rentals";

  const handleLogout = () => {
    logoutUser();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Build<span>Rent</span>
        </Link>

        <nav
          className={menuOpen ? "nav-links active" : "nav-links"}
        >
          <Link to="/" onClick={closeMenu}>Home</Link>

          <Link to="/equipment" onClick={closeMenu}>
            Equipment
          </Link>

          {isAuthenticated && currentUser?.role === "user" && (
            <Link to="/my-rentals" onClick={closeMenu}>
              My Rentals
            </Link>
          )}

          {isAuthenticated &&
            ["owner", "admin"].includes(currentUser?.role) && (
              <Link to={dashboardPath} onClick={closeMenu}>
                {currentUser.role === "owner"
                  ? "Owner Dashboard"
                  : "Admin Dashboard"}
              </Link>
            )}

          <Link to="/about" onClick={closeMenu}>About</Link>

          <Link to="/contact" onClick={closeMenu}>Contact</Link>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="login-btn"
                onClick={closeMenu}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="register-btn"
                onClick={closeMenu}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link to={profilePath} onClick={closeMenu}>
                {currentUser?.name || "Profile"}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        <button
          type="button"
          className="menu-btn"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
