import React, { useCallback, useEffect, useState } from "react";
import { useEquipment } from "../../context/EquipmentContext";
import "../../styles/adminReports.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function AdminReports() {
  const { equipment = [], loading: equipmentLoading, error: equipmentError } =
    useEquipment();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(RENTALS_API);

      if (!response.ok) {
        throw new Error("Failed to fetch rental reports.");
      }

      const data = await response.json();
      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching rental reports:", err);
      setError(err.message || "Unable to load rental reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const totalRentalValue = rentals
  .filter((rental) =>
    ["Approved", "Active", "Rented", "Returned", "Completed"].includes(
      rental.status
    )
  )
  .reduce(
    (total, rental) => total + (Number(rental.totalAmount) || 0),
    0
  );

  const approvedRentals = rentals.filter(
    (rental) => rental.status === "Approved"
  ).length;

  const pendingRentals = rentals.filter(
    (rental) => rental.status === "Pending"
  ).length;

  const completedRentals = rentals.filter((rental) =>
    ["Returned", "Completed"].includes(rental.status)
  ).length;

  const availableEquipment = equipment.filter(
    (item) => item.available === true
  ).length;

  const unavailableEquipment = equipment.length - availableEquipment;

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  const formatDate = (date) => {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN");
  };

  return (
    <section className="admin-reports">
      <div className="admin-page-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Reports</h1>
          <p>View rental activity and platform performance.</p>
        </div>
      </div>

      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchRentals}>
            Retry
          </button>
        </div>
      )}

      <div className="report-stats">
        <div className="report-card">
          <div className="report-card-icon">📋</div>
          <div>
            <span>Total Rentals</span>
            <strong>{rentals.length}</strong>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-icon">₹</div>
          <div>
            <span>Total Rental Value</span>
            <strong>₹{formatAmount(totalRentalValue)}</strong>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-icon">✓</div>
          <div>
            <span>Approved Rentals</span>
            <strong>{approvedRentals}</strong>
          </div>
        </div>

        <div className="report-card">
          <div className="report-card-icon">⏳</div>
          <div>
            <span>Pending Rentals</span>
            <strong>{pendingRentals}</strong>
          </div>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-panel">
          <div className="report-panel-header">
            <div>
              <span>RENTAL OVERVIEW</span>
              <h2>Rental Statistics</h2>
            </div>
          </div>

          <div className="rental-stat-list">
            <div className="rental-stat-row">
              <div>
                <span>Total Rentals</span>
                <small>All rental requests</small>
              </div>
              <strong>{rentals.length}</strong>
            </div>

            <div className="rental-stat-row">
              <div>
                <span>Pending</span>
                <small>Waiting for approval</small>
              </div>
              <strong>{pendingRentals}</strong>
            </div>

            <div className="rental-stat-row">
              <div>
                <span>Approved</span>
                <small>Approved rental requests</small>
              </div>
              <strong>{approvedRentals}</strong>
            </div>

            <div className="rental-stat-row">
              <div>
                <span>Completed</span>
                <small>Returned or completed rentals</small>
              </div>
              <strong>{completedRentals}</strong>
            </div>
          </div>
        </div>

        <div className="report-panel">
          <div className="report-panel-header">
            <div>
              <span>EQUIPMENT</span>
              <h2>Equipment Overview</h2>
            </div>
          </div>

          {equipmentLoading ? (
            <p>Loading equipment statistics...</p>
          ) : equipmentError ? (
            <p role="alert">{equipmentError}</p>
          ) : (
            <div className="equipment-report">
              <div className="equipment-report-item">
                <span>Total Equipment</span>
                <strong>{equipment.length}</strong>
              </div>

              <div className="equipment-report-item">
                <span>Available</span>
                <strong className="available-number">
                  {availableEquipment}
                </strong>
              </div>

              <div className="equipment-report-item">
                <span>Unavailable</span>
                <strong className="unavailable-number">
                  {unavailableEquipment}
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="report-panel rental-history">
        <div className="report-panel-header">
          <div>
            <span>RENTAL RECORDS</span>
            <h2>Rental History</h2>
          </div>

          <div className="history-count">
            {rentals.length} Records
          </div>
        </div>

        {loading ? (
          <p>Loading rental history...</p>
        ) : rentals.length === 0 ? (
          <div className="empty-report">
            <h3>No rental records</h3>
            <p>Rental requests will appear here.</p>
          </div>
        ) : (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Renter</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {rentals.map((rental) => {
                  const status = rental.status || "Pending";

                  return (
                    <tr key={rental.id}>
                      <td>
                        <strong>
                          {rental.equipmentName ||
                            rental.equipment ||
                            "Unknown Equipment"}
                        </strong>
                      </td>

                      <td>
                        <div className="report-renter">
                          <strong>
                            {rental.customerName ||
                              rental.renter ||
                              "Unknown Renter"}
                          </strong>
                          <span>
                            {rental.customerEmail ||
                              rental.renterEmail ||
                              "No email provided"}
                          </span>
                        </div>
                      </td>

                      <td>{formatDate(rental.startDate)}</td>
                      <td>{formatDate(rental.endDate)}</td>

                      <td>
                        <strong>
                          ₹{formatAmount(rental.totalAmount)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`report-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminReports;