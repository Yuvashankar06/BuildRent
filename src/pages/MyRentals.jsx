
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function MyRentals() {
  const { currentUser } = useAuth();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(RENTALS_API);

        if (!response.ok) {
          throw new Error("Unable to fetch rental records.");
        }

        const data = await response.json();

        const userRentals = data.filter(
          (rental) =>
            String(rental.customerId) === String(currentUser?.id)
        );

        setRentals(userRentals);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id != null) {
      fetchRentals();
    } else {
      setRentals([]);
      setLoading(false);
    }
  }, [currentUser]);

  const pendingCount = rentals.filter(
    (rental) => rental.status === "Pending"
  ).length;

  const activeCount = rentals.filter(
    (rental) =>
      rental.status === "Approved" ||
      rental.status === "Active"
  ).length;

  const completedCount = rentals.filter(
    (rental) => rental.status === "Completed"
  ).length;

  const rejectedCount = rentals.filter(
    (rental) => rental.status === "Rejected"
  ).length;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <section className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>My Rentals</h1>
            <p>
              Track your equipment rental requests and rental history.
            </p>
          </div>

          <Link to="/equipment" className="primary-btn">
            Browse Equipment
          </Link>
        </div>

        {loading ? (
          <p>Loading your rentals...</p>
        ) : error ? (
          <p role="alert" className="error-message">
            {error}
          </p>
        ) : (
          <>
            <div className="rental-stats">
              <div className="stat-card">
                <span>Total Rentals</span>
                <strong>{rentals.length}</strong>
              </div>

              <div className="stat-card">
                <span>Pending</span>
                <strong>{pendingCount}</strong>
              </div>

              <div className="stat-card">
                <span>Active</span>
                <strong>{activeCount}</strong>
              </div>

              <div className="stat-card">
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </div>

              <div className="stat-card">
                <span>Rejected</span>
                <strong>{rejectedCount}</strong>
              </div>
            </div>

            {rentals.length === 0 ? (
              <div className="empty-state">
                <h2>No rentals yet</h2>
                <p>
                  Your submitted rental requests will appear here.
                </p>
                <Link to="/equipment" className="primary-btn">
                  Explore Equipment
                </Link>
              </div>
            ) : (
              <div className="rentals-list">
                {rentals.map((rental) => (
                  <div className="rental-card" key={rental.id}>
                    <div className="rental-image">
                      <img
                        src={
                          rental.equipmentImage ||
                          "/Images/excavator.jpeg"
                        }
                        alt={rental.equipmentName}
                      />
                    </div>

                    <div className="rental-info">
                      <span className="rental-category">
                        {rental.equipmentCategory ||
                          "Construction Equipment"}
                      </span>

                      <h2>{rental.equipmentName}</h2>

                      <div className="rental-dates">
                        <div>
                          <span>Start Date</span>
                          <strong>
                            {formatDate(rental.startDate)}
                          </strong>
                        </div>

                        <div>
                          <span>End Date</span>
                          <strong>
                            {formatDate(rental.endDate)}
                          </strong>
                        </div>
                      </div>

                      <p>
                        Rental duration: {rental.days}{" "}
                        {Number(rental.days) === 1 ? "day" : "days"}
                      </p>

                      <div className="rental-bottom">
                        <div className="rental-amount">
                          ₹
                          {Number(
                            rental.totalAmount || 0
                          ).toLocaleString("en-IN")}
                        </div>

                        <span
                          className={`rental-status ${String(
                            rental.status || "Pending"
                          ).toLowerCase()}`}
                        >
                          {rental.status || "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default MyRentals;
