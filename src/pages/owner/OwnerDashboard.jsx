
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";
import "../../styles/dashboard.scss";

const EQUIPMENT_API = "http://localhost:3001/equipment";
const RENTALS_API = "http://localhost:3001/rentals";

function OwnerDashboard() {
  const [equipment, setEquipment] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const activeCount = rentals.filter(
    (rental) =>
      rental.status === "Approved" ||
      rental.status === "Active"
  ).length;

  const pendingCount = rentals.filter(
    (rental) => rental.status === "Pending"
  ).length;

  const completedCount = rentals.filter(
    (rental) => rental.status === "Completed"
  ).length;

  const stats = [
    {
      title: "Total Equipment",
      value: equipment.length,
      icon: <Package size={24} />,
      type: "equipment",
    },
    {
      title: "Active Rentals",
      value: activeCount,
      icon: <Truck size={24} />,
      type: "active",
    },
    {
      title: "Pending Requests",
      value: pendingCount,
      icon: <Clock size={24} />,
      type: "pending",
    },
    {
      title: "Completed Rentals",
      value: completedCount,
      icon: <CheckCircle size={24} />,
      type: "completed",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "Date not specified";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const recentRequests = [...rentals]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 3);

  return (
    <section className="owner-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <span className="dashboard-label">
              OWNER PANEL
            </span>

            <h1>Owner Dashboard</h1>

            <p>
              Manage your construction equipment and rental requests.
            </p>
          </div>

          <Link
            to="/owner/equipment/add"
            className="primary-btn"
          >
            + Add Equipment
          </Link>
        </div>

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            <div className="dashboard-stats">
              {stats.map((stat) => (
                <div
                  className={`dashboard-stat-card ${stat.type}`}
                  key={stat.title}
                >
                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <div>
                    <span>{stat.title}</span>
                    <strong>{stat.value}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-panel requests-panel">
                <div className="panel-header">
                  <div>
                    <h2>Recent Rental Requests</h2>
                    <p>Review the latest rental requests.</p>
                  </div>

                  <Link to="/owner/requests">
                    View All
                  </Link>
                </div>

                {recentRequests.length === 0 ? (
                  <p>No rental requests yet.</p>
                ) : (
                  <div className="request-list">
                    {recentRequests.map((request) => (
                      <div
                        className="request-item"
                        key={request.id}
                      >
                        <div className="request-info">
                          <h3>
                            {request.equipmentName ||
                              "Construction Equipment"}
                          </h3>

                          <p>
                            Requested by{" "}
                            {request.customerName || "Unknown customer"}
                          </p>

                          <span>
                            {formatDate(request.startDate)}
                            {" - "}
                            {formatDate(request.endDate)}
                          </span>
                        </div>

                        <div className="request-right">
                          <strong>
                            ₹
                            {Number(
                              request.totalAmount || 0
                            ).toLocaleString("en-IN")}
                          </strong>

                          <span
                            className={`request-status ${String(
                              request.status || "Pending"
                            ).toLowerCase()}`}
                          >
                            {request.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dashboard-panel">
                <div className="panel-header">
                  <div>
                    <h2>Quick Actions</h2>
                    <p>Manage your rental business.</p>
                  </div>
                </div>

                <div className="quick-actions">
                  <Link to="/owner/equipment/add">
                    <Package size={22} />
                    <div>
                      <strong>Add Equipment</strong>
                      <span>List new equipment</span>
                    </div>
                  </Link>

                  <Link to="/owner/equipment">
                    <Truck size={22} />
                    <div>
                      <strong>My Equipment</strong>
                      <span>Manage your equipment</span>
                    </div>
                  </Link>

                  <Link to="/owner/requests">
                    <Clock size={22} />
                    <div>
                      <strong>Rental Requests</strong>
                      <span>Review pending requests</span>
                    </div>
                  </Link>

                  <Link to="/owner/returns">
                    <CheckCircle size={22} />
                    <div>
                      <strong>Returns</strong>
                      <span>Manage equipment returns</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default OwnerDashboard;
