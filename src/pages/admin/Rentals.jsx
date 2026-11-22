import React, { useCallback, useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import "../../styles/adminRentals.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function AdminRentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(RENTALS_API);

      if (!response.ok) {
        throw new Error("Failed to fetch rental requests.");
      }

      const data = await response.json();
      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching rentals:", err);
      setError(err.message || "Unable to load rental requests.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const handleStatusChange = async (id, status) => {
    const confirmed = window.confirm(
      `Are you sure you want to change this rental status to "${status}"?`
    );

    if (!confirmed) return;

    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(
        `${RENTALS_API}/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            ...(status === "Returned" || status === "Completed"
              ? { returnedAt: new Date().toISOString() }
              : {}),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update rental status.");
      }

      const updatedRental = await response.json();

      setRentals((previous) =>
        previous.map((rental) =>
          String(rental.id) === String(id) ? updatedRental : rental
        )
      );
    } catch (err) {
      console.error("Error updating rental:", err);
      setError(err.message || "Unable to update rental status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = rentals.filter(
    (rental) => rental.status === "Pending"
  ).length;

  const approvedCount = rentals.filter(
    (rental) => rental.status === "Approved"
  ).length;

  const completedCount = rentals.filter(
    (rental) =>
      rental.status === "Completed" || rental.status === "Returned"
  ).length;

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  return (
    <section className="admin-rentals">
      <div className="admin-page-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Rental Management</h1>
          <p>Monitor and manage all equipment rental requests.</p>
        </div>

        <div className="rental-count">{rentals.length} Rentals</div>
      </div>

      <div className="rental-summary">
        <div className="rental-summary-card">
          <span>Total Rentals</span>
          <strong>{rentals.length}</strong>
        </div>

        <div className="rental-summary-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="rental-summary-card">
          <span>Approved</span>
          <strong>{approvedCount}</strong>
        </div>

        <div className="rental-summary-card">
          <span>Completed / Returned</span>
          <strong>{completedCount}</strong>
        </div>
      </div>

      <div className="admin-rentals-card">
        {loading ? (
          <p>Loading rental requests...</p>
        ) : error && rentals.length === 0 ? (
          <div className="empty-rentals">
            <h3>Unable to load rentals</h3>
            <p>{error}</p>
            <button type="button" onClick={fetchRentals}>
              Retry
            </button>
          </div>
        ) : rentals.length === 0 ? (
          <div className="empty-rentals">
            <h3>No rental requests found</h3>
            <p>Rental requests will appear here.</p>
          </div>
        ) : (
          <>
            {error && <p role="alert">{error}</p>}

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Equipment</th>
                    <th>Renter</th>
                    <th>Rental Period</th>
                    <th>Days</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rentals.map((rental) => {
                    const status = rental.status || "Pending";
                    const isUpdating =
                      String(updatingId) === String(rental.id);

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
                          <div className="renter-info">
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

                        <td>
                          <div className="rental-dates">
                            <span>{rental.startDate || "—"}</span>
                            <span>to</span>
                            <span>{rental.endDate || "—"}</span>
                          </div>
                        </td>

                        <td>{rental.days ?? "—"}</td>

                        <td>₹{formatAmount(rental.totalAmount)}</td>

                        <td>
                          <StatusBadge status={status} />
                        </td>

                        <td>
                          <div className="rental-actions">
                            {status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  className="approve-btn"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleStatusChange(
                                      rental.id,
                                      "Approved"
                                    )
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  className="reject-btn"
                                  disabled={isUpdating}
                                  onClick={() =>
                                    handleStatusChange(
                                      rental.id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {status === "Approved" && (
                              <button
                                type="button"
                                className="rent-btn"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(
                                    rental.id,
                                    "Active"
                                  )
                                }
                              >
                                Mark Active
                              </button>
                            )}

                            {status === "Active" && (
                              <button
                                type="button"
                                className="return-btn"
                                disabled={isUpdating}
                                onClick={() =>
                                  handleStatusChange(
                                    rental.id,
                                    "Completed"
                                  )
                                }
                              >
                                Mark Returned
                              </button>
                            )}

                            {[
                              "Rejected",
                              "Returned",
                              "Completed",
                            ].includes(status) && (
                              <span className="no-action">
                                No action
                              </span>
                            )}

                            {isUpdating && <span>Updating...</span>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default AdminRentals;