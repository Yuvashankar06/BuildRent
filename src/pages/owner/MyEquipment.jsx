import React from "react";
import { Link } from "react-router-dom";
import { useEquipment } from "../../context/EquipmentContext";
import "../../styles/ownerequipment.scss";

function MyEquipment() {
  const { equipment, deleteEquipment } = useEquipment();

  return (
    <section className="owner-equipment-page">
      <div className="container">
        <div className="owner-page-header">
          <div>
            <span className="page-label">OWNER PANEL</span>

            <h1>My Equipment</h1>

            <p>Manage the construction equipment you have listed for rental.</p>
          </div>

          <Link to="/owner/equipment/add" className="primary-btn">
            + Add Equipment
          </Link>
        </div>

        <div className="equipment-count">
          <strong>{equipment.length}</strong>
          <span>Equipment Listed</span>
        </div>

        <div className="owner-equipment-grid">
          {equipment.map((item) => (
            <div className="owner-equipment-card" key={item.id}>
              <div className="owner-equipment-image">
                <img src={item.image} alt={item.name} />

                <span
                  className={
                    item.available
                      ? "equipment-status available"
                      : "equipment-status unavailable"
                  }
                >
                  {item.available ? "Available" : "Unavailable"}
                </span>
              </div>

              <div className="owner-equipment-content">
                <span className="equipment-category">{item.category}</span>

                <h2>{item.name}</h2>

                <p>{item.description}</p>

                <div className="owner-equipment-details">
                  <div>
                    <span>Location</span>
                    <strong>📍 {item.location}</strong>
                  </div>

                  <div>
                    <span>Rental Price</span>
                    <strong>
                      ₹{item.price.toLocaleString()}
                      <small> / day</small>
                    </strong>
                  </div>
                </div>

                <div className="equipment-actions">
                  <Link
                    to={`/owner/equipment/edit/${item.id}`}
                    className="edit-btn"
                  >
                    Edit
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => {
                      const confirmed = window.confirm(
                        `Are you sure you want to delete ${item.name}?`,
                      );

                      if (confirmed) {
                        deleteEquipment(item.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MyEquipment;
