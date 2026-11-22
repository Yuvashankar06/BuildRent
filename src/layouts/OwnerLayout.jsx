import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import OwnerHeader from "../components/OwnerHeader";
import "../styles/ownerLayout.scss";

function OwnerLayout() {
  return (
    <div className="owner-layout">
      <OwnerHeader />

      <div className="owner-body">
        <aside className="owner-sidebar">
          <div className="owner-sidebar-header">
            <h2>Owner Panel</h2>
            <p>Equipment Management</p>
          </div>

          <nav className="owner-nav">
            <NavLink to="/owner/dashboard">Dashboard</NavLink>

            <NavLink to="/owner/equipment">My Equipment</NavLink>

            <NavLink to="/owner/equipment/add">Add Equipment</NavLink>

            <NavLink to="/owner/requests">Rental Requests</NavLink>

            <NavLink to="/owner/returns">Returns</NavLink>

            <NavLink to="/owner/profile">My Profile</NavLink>

            <NavLink to="/">Back to Website</NavLink>
          </nav>
        </aside>

        <main className="owner-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OwnerLayout;
