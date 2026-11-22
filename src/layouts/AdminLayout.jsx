import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import "../styles/adminLayout.scss";

function AdminLayout() {
  return (
    <div className="admin-layout">

      <AdminHeader />

      <div className="admin-body">

        <aside className="admin-sidebar">

          <div className="admin-sidebar-header">
            <h2>Admin Panel</h2>
            <p>Rental Management</p>
          </div>

          <nav className="admin-nav">

            <NavLink to="/admin/dashboard">
              Dashboard
            </NavLink>

            <NavLink to="/admin/users">
              Users
            </NavLink>

            <NavLink to="/admin/equipment">
              Equipment
            </NavLink>

            <NavLink to="/admin/rentals">
              Rentals
            </NavLink>

            <NavLink to="/admin/transactions">
              Transactions
            </NavLink>

            <NavLink to="/admin/reports">
              Reports
            </NavLink>

            <NavLink to="/">
              Back to Website
            </NavLink>

          </nav>

        </aside>

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;