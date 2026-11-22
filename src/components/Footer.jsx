import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.scss";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-main">

          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              BuildRent
            </Link>

            <p>
              Reliable construction equipment rental for
              projects of every size.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>

            <Link to="/">Home</Link>
            <Link to="/equipment">Equipment</Link>
            <Link to="/my-rentals">My Rentals</Link>
            <Link to="/profile">Profile</Link>
          </div>

          {/* Equipment */}
          <div className="footer-column">
            <h3>Equipment</h3>

            <Link to="/equipment">Excavators</Link>
            <Link to="/equipment">Cranes</Link>
            <Link to="/equipment">Loaders</Link>
            <Link to="/equipment">Construction Equipment</Link>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h3>Contact</h3>

            <p>📍 Mumbai, Maharashtra</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@buildrent.com</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} BuildRent. All rights reserved.
          </p>

          <div className="footer-bottom-links">
            <Link to="/">Privacy Policy</Link>
            <Link to="/">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;