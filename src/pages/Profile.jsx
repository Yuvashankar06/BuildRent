import React, { useState } from "react";
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.scss";

function Profile() {
  const { currentUser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  if (!currentUser) {
    return (
      <section className="profile-page">
        <div className="profile-empty">
          <h2>Please login to view your profile.</h2>

          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </section>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const updatedUsers = users.map((user) =>
      user.email === currentUser.email
        ? {
            ...user,
            name: formData.name,
            phone: formData.phone,
          }
        : user,
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const updatedCurrentUser = {
      ...currentUser,
      name: formData.name,
      phone: formData.phone,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    window.location.reload();
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <section className="profile-page">
      <div className="profile-container">
        {/* Header */}

        <div className="profile-header">
          <span className="profile-label">MY ACCOUNT</span>

          <h1>My Profile</h1>

          <p>Manage your account information and preferences.</p>
        </div>

        {/* Profile Card */}

        <div className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar">
              {currentUser.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>{currentUser.name}</h2>

              <span className="profile-role">
                {currentUser.role === "owner" ? "Equipment Owner" : "User"}
              </span>
            </div>
          </div>

          {/* Information */}

          {!isEditing ? (
            <div className="profile-information">
              <div className="profile-info-item">
                <span>Full Name</span>
                <strong>{currentUser.name}</strong>
              </div>

              <div className="profile-info-item">
                <span>Email Address</span>
                <strong>{currentUser.email}</strong>
              </div>

              <div className="profile-info-item">
                <span>Phone Number</span>
                <strong>{currentUser.phone || "Not provided"}</strong>
              </div>

              <div className="profile-info-item">
                <span>Account Type</span>
                <strong>
                  {currentUser.role === "owner"
                    ? "Equipment Owner"
                    : "Customer"}
                </strong>
              </div>
            </div>
          ) : (
            <form className="profile-form" onSubmit={handleSave}>
              <div className="profile-form-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="profile-form-group">
                <label>Email Address</label>

                <input type="email" value={formData.email} disabled />
              </div>

              <div className="profile-form-group">
                <label>Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  className="profile-cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="profile-save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          )}
          {/* {currentUser.role === "owner" && (
            <div className="profile-actions">
              <Link to="/owner/dashboard" className="edit-profile-btn">
                Back to Owner Dashboard
              </Link>

              <Link to="/" className="edit-profile-btn">
                Back to Website
              </Link>
            </div>
          )} */}

          {/* Actions */}

          {!isEditing && (
            <div className="profile-actions">
              <button
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

              <button className="logout-profile-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
