import React, { useCallback, useEffect, useState } from "react";
import "../../styles/adminTransactions.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function AdminTransactions() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(RENTALS_API);

      if (!response.ok) {
        throw new Error("Failed to fetch transactions.");
      }

      const data = await response.json();
      setRentals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Unable to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const totalTransactions = rentals.length;

  // These are rental requests that have been approved or progressed.
  // They are not verified payment transactions.
  const successfulTransactions = rentals.filter((rental) =>
    ["Approved", "Active", "Rented", "Returned", "Completed"].includes(
      rental.status
    )
  ).length;

  const totalRevenue = rentals
  .filter((rental) =>
    ["Approved", "Active", "Rented", "Returned", "Completed"].includes(
      rental.status
    )
  )
  .reduce(
    (total, rental) => total + (Number(rental.totalAmount) || 0),
    0
  );

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");

  return (
    <section className="admin-transactions">
      <div className="admin-page-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Transactions</h1>
          <p>View and monitor all rental transactions.</p>
        </div>

        <div className="transaction-count">
          {totalTransactions} Transactions
        </div>
      </div>

      <div className="transaction-summary">
        <div className="transaction-summary-card">
          <span>Total Transactions</span>
          <strong>{totalTransactions}</strong>
        </div>

        <div className="transaction-summary-card">
          <span>Successful Rentals</span>
          <strong>{successfulTransactions}</strong>
        </div>

        <div className="transaction-summary-card">
          <span>Total Rental Value</span>
          <strong>₹{formatAmount(totalRevenue)}</strong>
        </div>
      </div>

      <div className="transactions-card">
        {loading ? (
          <p>Loading transactions...</p>
        ) : error ? (
          <div className="empty-transactions">
            <h3>Unable to load transactions</h3>
            <p>{error}</p>
            <button type="button" onClick={fetchRentals}>
              Retry
            </button>
          </div>
        ) : rentals.length === 0 ? (
          <div className="empty-transactions">
            <h3>No transactions found</h3>
            <p>Rental records will appear here when requests are submitted.</p>
          </div>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Equipment</th>
                  <th>Renter</th>
                  <th>Rental Period</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction Date</th>
                </tr>
              </thead>

              <tbody>
                {rentals.map((rental) => {
                  const status = rental.status || "Pending";

                  return (
                    <tr key={rental.id}>
                      <td>
                        <span className="transaction-id">
                          TXN-{rental.id}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {rental.equipmentName ||
                            rental.equipment ||
                            "Unknown Equipment"}
                        </strong>
                      </td>

                      <td>
                        <div className="transaction-renter">
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
                        <div className="transaction-period">
                          <span>{rental.startDate || "—"}</span>
                          <span>to</span>
                          <span>{rental.endDate || "—"}</span>
                        </div>
                      </td>

                      <td>
                        <strong>
                          ₹{formatAmount(rental.totalAmount)}
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`transaction-status ${status.toLowerCase()}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        {rental.createdAt
                          ? new Date(rental.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : rental.startDate || "—"}
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

export default AdminTransactions;