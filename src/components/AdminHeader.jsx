import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/adminHeader.scss";

function AdminHeader() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">

        <div className="admin-logo">
          Build<span>Rent</span>
          <small>ADMIN</small>
        </div>

        <div className="admin-header-right">

          <div className="admin-user">
            <div className="admin-user-avatar">
              {currentUser?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="admin-user-info">
              <strong>
                {currentUser?.name || "System Admin"}
              </strong>

              <span>Administrator</span>
            </div>
          </div>

          <button
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}

export default AdminHeader;