import React from "react";
import { Link } from "react-router-dom";

function EquipmentCard({ equipment }) {
  return (
    <div className="equipment-card">

      <div className="equipment-image">
        <img
          src={equipment.image}
          alt={equipment.name}
        />

        <span
          className={
            equipment.available
              ? "status available"
              : "status unavailable"
          }
        >
          {equipment.available
            ? "Available"
            : "Not Available"}
        </span>
      </div>

      <div className="equipment-content">

        <span className="equipment-category">
          {equipment.category}
        </span>

        <h3>{equipment.name}</h3>

        <p>{equipment.description}</p>

        <div className="equipment-location">
          📍 {equipment.location}
        </div>

        <div className="equipment-bottom">

          <div className="price">
            ₹{equipment.price.toLocaleString()}
            <span> / day</span>
          </div>

          <Link
            to={`/equipment/${equipment.id}`}
            className="view-btn"
          >
            View Details
          </Link>

        </div>

      </div>

    </div>
  );
}

export default EquipmentCard;