
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useEquipment } from "../context/EquipmentContext";
import "../styles/details.scss";

function EquipmentDetails() {
  const { id } = useParams();
  const { equipment, loading, error } = useEquipment();

  const selectedEquipment = equipment.find(
    (item) => String(item.id) === String(id)
  );

  if (loading) {
    return (
      <div className="container">
        <p>Loading equipment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <h2>Unable to Load Equipment</h2>
        <p>{error}</p>
        <Link to="/equipment">Back to Equipment</Link>
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

  const specifications = selectedEquipment.specifications || {};

  return (
    <section className="details-page">
      <div className="container">
        <Link to="/equipment" className="back-link">
          ← Back to Equipment
        </Link>

        <div className="details-container">
          {/* Image */}
          <div className="details-image">
            <img
              src={selectedEquipment.image}
              alt={selectedEquipment.name}
            />
          </div>

          {/* Information */}
          <div className="details-content">
            <span className="details-category">
              {selectedEquipment.category}
            </span>

            <h1>{selectedEquipment.name}</h1>

            <p className="details-description">
              {selectedEquipment.description}
            </p>

            <div className="details-price">
              ₹{Number(selectedEquipment.price).toLocaleString()}
              <span> / day</span>
            </div>

            <div className="details-location">
              📍 {selectedEquipment.location}
            </div>

            <div
              className={
                selectedEquipment.available
                  ? "availability available"
                  : "availability unavailable"
              }
            >
              {selectedEquipment.available
                ? "✓ Currently Available"
                : "✕ Currently Unavailable"}
            </div>

            <h3>Specifications</h3>

            <div className="specifications">
              <div>
                <span>Model</span>
                <strong>{specifications.model || "N/A"}</strong>
              </div>

              <div>
                <span>Year</span>
                <strong>{specifications.year || "N/A"}</strong>
              </div>

              <div>
                <span>Fuel</span>
                <strong>{specifications.fuel || "N/A"}</strong>
              </div>

              <div>
                <span>Weight</span>
                <strong>{specifications.weight || "N/A"}</strong>
              </div>
            </div>

            {selectedEquipment.available ? (
              <Link
                to={`/rental-request/${selectedEquipment.id}`}
                className="rent-btn"
              >
                Request Rental
              </Link>
            ) : (
              <button className="rent-btn disabled" disabled>
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EquipmentDetails;
