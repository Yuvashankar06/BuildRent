import React, { useEffect, useState } from "react";
import "../../styles/rentalRequests.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function RentalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(RENTALS_API);

      if (!response.ok) {
        throw new Error("Unable to load rental requests.");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message || "Failed to load rental requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (request, newStatus) => {
    try {
      setUpdatingId(request.id);
      setError("");

      const response = await fetch(
        `${RENTALS_API}/${request.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update rental status.");
      }

      const updatedRequest = await response.json();

      setRequests((previousRequests) =>
        previousRequests.map((item) =>
          String(item.id) === String(updatedRequest.id)
            ? updatedRequest
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update rental status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = requests.filter(
    (request) => request.status === "Pending"
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "Approved"
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "Rejected"
  ).length;

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="rental-requests-page">
      <div className="rental-requests-container">
        <div className="rental-requests-header">
          <div>
            <span className="page-label">OWNER PANEL</span>
            <h1>Rental Requests</h1>
            <p>Review and manage rental requests from customers.</p>
          </div>
        </div>

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        <div className="request-summary">
          <div className="summary-card">
            <span>Total Requests</span>
            <strong>{requests.length}</strong>
          </div>

          <div className="summary-card pending">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </div>

          <div className="summary-card approved">
            <span>Approved</span>
            <strong>{approvedCount}</strong>
          </div>

          <div className="summary-card rejected">
            <span>Rejected</span>
            <strong>{rejectedCount}</strong>
          </div>
        </div>

        {loading ? (
          <p>Loading rental requests...</p>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <h2>No rental requests yet</h2>
            <p>Customer requests will appear here when submitted.</p>
          </div>
        ) : (
          <div className="requests-list">
            {requests.map((request) => (
              <div className="request-card" key={request.id}>
                <div className="request-card-header">
                  <div>
                    <span className="request-label">EQUIPMENT</span>
                    <h2>
                      {request.equipmentName || "Construction Equipment"}
                    </h2>
                  </div>

                  <span
                    className={`request-status ${String(
                      request.status || "Pending"
                    ).toLowerCase()}`}
                  >
                    {request.status || "Pending"}
                  </span>
                </div>

                <div className="request-details">
                  <div className="detail-section">
                    <h3>Renter Information</h3>

                    <div className="detail-item">
                      <span>Name</span>
                      <strong>{request.customerName || "N/A"}</strong>
                    </div>

                    <div className="detail-item">
                      <span>Email</span>
                      <strong>{request.customerEmail || "N/A"}</strong>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Rental Information</h3>

                    <div className="detail-item">
                      <span>Start Date</span>
                      <strong>{formatDate(request.startDate)}</strong>
                    </div>

                    <div className="detail-item">
                      <span>End Date</span>
                      <strong>{formatDate(request.endDate)}</strong>
                    </div>

                    <div className="detail-item">
                      <span>Duration</span>
                      <strong>{request.days} days</strong>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h3>Payment</h3>

                    <div className="detail-item">
                      <span>Price / Day</span>
                      <strong>
                        ₹
                        {Number(request.pricePerDay || 0).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>

                    <div className="detail-item total">
                      <span>Total Amount</span>
                      <strong>
                        ₹
                        {Number(request.totalAmount || 0).toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="request-actions">
                  {request.status === "Pending" ? (
                    <>
                      <button
                        type="button"
                        className="reject-btn"
                        disabled={updatingId !== null}
                        onClick={() =>
                          handleStatusChange(request, "Rejected")
                        }
                      >
                        {updatingId === request.id
                          ? "Updating..."
                          : "Reject"}
                      </button>

                      <button
                        type="button"
                        className="approve-btn"
                        disabled={updatingId !== null}
                        onClick={() =>
                          handleStatusChange(request, "Approved")
                        }
                      >
                        {updatingId === request.id
                          ? "Updating..."
                          : "Approve"}
                      </button>
                    </>
                  ) : (
                    <span className="action-message">
                      Request {String(request.status).toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default RentalRequests;
