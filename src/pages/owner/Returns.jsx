
import React, { useEffect, useState } from "react";
import "../../styles/returns.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function Returns() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(RENTALS_API);

      if (!response.ok) {
        throw new Error("Unable to load rental records.");
      }

      const data = await response.json();

      // Only approved and active rentals can be returned.
      setRentals(
        data.filter(
          (rental) =>
            rental.status === "Approved" ||
            rental.status === "Active" ||
            rental.status === "Completed"
        )
      );
    } catch (err) {
      setError(err.message || "Failed to load rental records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleReturn = async (rental) => {
    const confirmed = window.confirm(
      "Are you sure you want to mark this equipment as returned?"
    );

    if (!confirmed) return;

    try {
      setUpdatingId(rental.id);
      setError("");

      const response = await fetch(
        `${RENTALS_API}/${rental.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Completed",
            returnedAt: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the rental return status.");
      }

      const updatedRental = await response.json();

      setRentals((previousRentals) =>
        previousRentals.map((item) =>
          String(item.id) === String(updatedRental.id)
            ? updatedRental
            : item
        )
      );
    } catch (err) {
      setError(err.message || "Unable to complete the return.");
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalCount = rentals.length;

  const rentedCount = rentals.filter(
    (rental) =>
      rental.status === "Approved" || rental.status === "Active"
  ).length;

  const returnedCount = rentals.filter(
    (rental) => rental.status === "Completed"
  ).length;

  return (
    <section className="returns-page">
      <div className="returns-container">
        <div className="returns-header">
          <div>
            <span className="page-label">OWNER PANEL</span>
            <h1>Rental Returns</h1>
            <p>
              Track rented equipment and manage equipment returns.
            </p>
          </div>
        </div>

        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}

        <div className="returns-summary">
          <div className="return-summary-card">
            <span>Total Rentals</span>
            <strong>{totalCount}</strong>
          </div>

          <div className="return-summary-card rented">
            <span>Currently Rented</span>
            <strong>{rentedCount}</strong>
          </div>

          <div className="return-summary-card returned">
            <span>Returned</span>
            <strong>{returnedCount}</strong>
          </div>
        </div>

        {loading ? (
          <p>Loading rental records...</p>
        ) : rentals.length === 0 ? (
          <div className="empty-state">
            <h2>No approved rentals yet</h2>
            <p>
              Approved rental requests will appear here when ready for return.
            </p>
          </div>
        ) : (
          <div className="returns-list">
            {rentals.map((rental) => (
              <div className="return-card" key={rental.id}>
                <div className="return-card-header">
                  <div>
                    <span className="return-label">EQUIPMENT</span>
                    <h2>
                      {rental.equipmentName || "Construction Equipment"}
                    </h2>
                  </div>

                  <span
                    className={`return-status ${
                      rental.status === "Completed"
                        ? "returned"
                        : "rented"
                    }`}
                  >
                    {rental.status === "Completed"
                      ? "Returned"
                      : "Rented"}
                  </span>
                </div>

                <div className="return-details">
                  <div className="return-detail">
                    <span>Renter</span>
                    <strong>{rental.customerName || "N/A"}</strong>
                  </div>

                  <div className="return-detail">
                    <span>Start Date</span>
                    <strong>{formatDate(rental.startDate)}</strong>
                  </div>

                  <div className="return-detail">
                    <span>End Date</span>
                    <strong>{formatDate(rental.endDate)}</strong>
                  </div>

                  <div className="return-detail">
                    <span>Rental Duration</span>
                    <strong>{rental.days ?? "N/A"} Days</strong>
                  </div>

                  <div className="return-detail">
                    <span>Total Amount</span>
                    <strong>
                      ₹
                      {Number(rental.totalAmount || 0).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>
                </div>

                <div className="return-actions">
                  {rental.status !== "Completed" ? (
                    <button
                      type="button"
                      className="return-btn"
                      disabled={updatingId !== null}
                      onClick={() => handleReturn(rental)}
                    >
                      {updatingId === rental.id
                        ? "Updating..."
                        : "Mark as Returned"}
                    </button>
                  ) : (
                    <span className="returned-message">
                      ✓ Equipment Returned
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

export default Returns;
