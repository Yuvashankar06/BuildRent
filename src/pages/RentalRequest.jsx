
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useEquipment } from "../context/EquipmentContext";
import { useAuth } from "../context/AuthContext";
import "../styles/rentalRequest.scss";

const RENTALS_API = "http://localhost:3001/rentals";

function RentalRequest() {
  const { id } = useParams();
  const { equipment, loading, error } = useEquipment();
  const { currentUser } = useAuth();

  const selectedEquipment = equipment.find(
    (item) => String(item.id) === String(id)
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };

  const days = calculateDays();

  const totalAmount =
    days > 0 && selectedEquipment
      ? days * Number(selectedEquipment.price)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!currentUser) {
      setSubmitError("Please log in before requesting a rental.");
      return;
    }

    if (!startDate || !endDate) {
      setSubmitError("Please select both rental dates.");
      return;
    }

    if (startDate < localToday) {
      setSubmitError("The start date cannot be in the past.");
      return;
    }

    if (days <= 0) {
      setSubmitError("The end date must be after the start date.");
      return;
    }

    if (!selectedEquipment.available) {
      setSubmitError("This equipment is currently unavailable.");
      return;
    }

    setSubmitting(true);

    try {
      const rentalRequest = {
        equipmentId: selectedEquipment.id,
        equipmentName: selectedEquipment.name,
        equipmentImage: selectedEquipment.image,
        equipmentLocation: selectedEquipment.location,
        pricePerDay: Number(selectedEquipment.price),
        customerId: currentUser.id,
        customerName: currentUser.name,
        customerEmail: currentUser.email,
        startDate,
        endDate,
        days,
        totalAmount,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(RENTALS_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rentalRequest),
      });

      if (!response.ok) {
        throw new Error("Failed to save the rental request.");
      }

      alert("Rental request submitted successfully!");

      setStartDate("");
      setEndDate("");
    } catch (err) {
      setSubmitError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <p>Loading equipment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Unable to Load Equipment</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!selectedEquipment) {
    return (
      <div className="container not-found">
        <h2>Equipment Not Found</h2>
        <Link to="/equipment">Back to Equipment</Link>
      </div>
    );
  }

  return (
    <section className="rental-page">
      <div className="container">
        <Link
          to={`/equipment/${selectedEquipment.id}`}
          className="back-link"
        >
          ← Back to Equipment Details
        </Link>

        <div className="rental-layout">
          <div className="rental-equipment">
            <img
              src={selectedEquipment.image}
              alt={selectedEquipment.name}
            />

            <div className="rental-equipment-info">
              <span>{selectedEquipment.category}</span>
              <h2>{selectedEquipment.name}</h2>
              <p>📍 {selectedEquipment.location}</p>

              <strong>
                ₹{Number(selectedEquipment.price).toLocaleString()}
                <small> / day</small>
              </strong>
            </div>
          </div>

          <div className="rental-form-container">
            <h1>Request Equipment Rental</h1>
            <p>Select the rental period for this equipment.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  min={localToday}
                  onChange={(e) => {
                    const value = e.target.value;
                    setStartDate(value);

                    if (endDate && value >= endDate) {
                      setEndDate("");
                    }
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  min={startDate || localToday}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="rental-summary">
                <div>
                  <span>Price per day</span>
                  <strong>
                    ₹{Number(selectedEquipment.price).toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Number of days</span>
                  <strong>{days > 0 ? days : "-"}</strong>
                </div>

                <div className="total">
                  <span>Total Amount</span>
                  <strong>₹{totalAmount.toLocaleString()}</strong>
                </div>
              </div>

              {submitError && (
                <p role="alert" className="error-message">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="submit-rental-btn"
                disabled={
                  submitting || selectedEquipment.available === false
                }
              >
                {submitting
                  ? "Submitting..."
                  : selectedEquipment.available === false
                  ? "Equipment Unavailable"
                  : "Submit Rental Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RentalRequest;
