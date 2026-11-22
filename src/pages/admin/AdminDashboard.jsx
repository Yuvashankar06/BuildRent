
import React, { useEffect, useState } from "react";
import "../../styles/adminDashboard.scss";

const EQUIPMENT_API = "http://localhost:3001/equipment";
const RENTALS_API = "http://localhost:3001/rentals";

function AdminDashboard() {
  const [equipment, setEquipment] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTotalUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("users") || "[]").length;
    } catch {
      return 0;
    }
  };

  const [totalUsers, setTotalUsers] = useState(getTotalUsers);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [equipmentResponse, rentalsResponse] =
          await Promise.all([
            fetch(EQUIPMENT_API),
            fetch(RENTALS_API),
          ]);

        if (!equipmentResponse.ok || !rentalsResponse.ok) {
          throw new Error("Unable to load dashboard data.");
        }

        const equipmentData = await equipmentResponse.json();
        const rentalsData = await rentalsResponse.json();

        setEquipment(equipmentData);
        setRentals(rentalsData);
        setTotalUsers(getTotalUsers());
      } catch (err) {
        setError(
          err.message || "Failed to load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const pendingRentals = rentals.filter(
    (rental) => rental.status === "Pending"
  ).length;

  const activeRentals = rentals.filter(
    (rental) =>
      rental.status === "Approved" ||
      rental.status === "Active"
  ).length;

  const completedRentals = rentals.filter(
    (rental) => rental.status === "Completed"
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const recentRentals = [...rentals]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <section className="admin-dashboard">
      <div className="admin-page-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Dashboard</h1>
          <p>Monitor users, equipment and rental activity.</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}

      {loading ? (
        <p>Loading dashboard data...</p>
      ) : (
        <>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <div className="stat-icon">👥</div>
              <div>
                <span>Total Users</span>
                <h2>{totalUsers}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">🚜</div>
              <div>
                <span>Total Equipment</span>
                <h2>{equipment.length}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">⏳</div>
              <div>
                <span>Pending Rentals</span>
                <h2>{pendingRentals}</h2>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="stat-icon">📋</div>
              <div>
                <span>Active Rentals</span>
                <h2>{activeRentals}</h2>
              </div>
            </div>
          </div>

          <div className="admin-dashboard-grid">
            <div className="admin-panel">
              <div className="panel-header">
                <h2>Recent Rental Requests</h2>
              </div>

              {recentRentals.length === 0 ? (
                <div className="empty-admin">
                  <p>No rental requests found.</p>
                </div>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Equipment</th>
                        <th>Renter</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentRentals.map((rental) => (
                        <tr key={rental.id}>
                          <td>
                            {rental.equipmentName || "N/A"}
                          </td>
                          <td>
                            {rental.customerName || "N/A"}
                          </td>
                          <td>{formatDate(rental.startDate)}</td>
                          <td>{formatDate(rental.endDate)}</td>
                          <td>
                            <span
                              className={`admin-status ${String(
                                rental.status || "Pending"
                              ).toLowerCase()}`}
                            >
                              {rental.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="admin-panel">
              <div className="panel-header">
                <h2>Equipment Overview</h2>
              </div>

              <div className="equipment-overview">
                <div>
                  <span>Total Equipment</span>
                  <strong>{equipment.length}</strong>
                </div>

                <div>
                  <span>Available</span>
                  <strong>
                    {equipment.filter(
                      (item) => item.available === true
                    ).length}
                  </strong>
                </div>

                <div>
                  <span>Unavailable</span>
                  <strong>
                    {equipment.filter(
                      (item) => item.available === false
                    ).length}
                  </strong>
                </div>

                <div>
                  <span>Completed Rentals</span>
                  <strong>{completedRentals}</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default AdminDashboard;
