import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Equipment from "../pages/Equipment";
import EquipmentDetails from "../pages/EquipmentDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import RentalRequest from "../pages/RentalRequest";
import MyRentals from "../pages/MyRentals";
import Profile from "../pages/Profile";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import MyEquipment from "../pages/owner/MyEquipment";
import AddEquipment from "../pages/owner/AddEquipment";
import EditEquipment from "../pages/owner/EditEquipment";
import RentalRequests from "../pages/owner/RentalRequests";
import Returns from "../pages/owner/Returns";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layouts/MainLayout";
import OwnerLayout from "../layouts/OwnerLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/Users";
import AdminEquipment from "../pages/admin/EquipmentManagement";
import AdminRentals from "../pages/admin/Rentals";
import AdminReports from "../pages/admin/AdminReports";
import AdminTransactions from "../pages/admin/Transaction";
import About from "../pages/About";
import Contact from "../pages/Contact";

function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC WEBSITE AND CUSTOMER ROUTES */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment/:id" element={<EquipmentDetails />} />
        <Route path="/rental-request/:id" element={<RentalRequest />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/my-rentals"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MyRentals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* AUTHENTICATION */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* OWNER ROUTES */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/equipment" element={<MyEquipment />} />
        <Route path="/owner/equipment/add" element={<AddEquipment />} />
        <Route path="/owner/equipment/edit/:id" element={<EditEquipment />} />
        <Route path="/owner/requests" element={<RentalRequests />} />
        <Route path="/owner/returns" element={<Returns />} />
        <Route path="/owner/profile" element={<Profile />} />
        <Route path="/owner/about" element={<About />} />
        <Route path="/owner/contact" element={<Contact />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/equipment" element={<AdminEquipment />} />
        <Route path="/admin/equipment/add" element={<AddEquipment />} />
        <Route path="/admin/equipment/edit/:id" element={<EditEquipment />} />
        <Route path="/admin/rentals" element={<AdminRentals />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
