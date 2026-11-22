import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/ownerHeader.scss";

function OwnerHeader() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="owner-header">
      <div className="owner-header-container">

        <div className="owner-logo">
          Build<span>Rent</span>
          <small>OWNER</small>
        </div>

        <div className="owner-header-right">

          <div className="owner-user">
            <div className="owner-user-avatar">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="owner-user-info">
              <strong>
                {currentUser?.name || "Equipment Owner"}
              </strong>

              <span>Equipment Owner</span>
            </div>
          </div>

          <button
            className="owner-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default OwnerHeader;