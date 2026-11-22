import React from "react";
import { useEquipment } from "../context/EquipmentContext";
import EquipmentCard from "../components/EquipmentCard";
import "../styles/equipment.scss";

function Equipment() {
  const { equipment, loading, error } = useEquipment();

  return (
    <section className="equipment-page">
      <div className="container">
        <div className="equipment-header">
          <h1>Construction Equipment</h1>
          <p>
            Find the right equipment for your construction project.
          </p>
        </div>

        {loading && <p>Loading equipment...</p>}

        {error && (
          <p className="error-message">
            Failed to load equipment: {error}
          </p>
        )}

        {!loading && !error && equipment.length === 0 && (
          <p>No equipment available at the moment.</p>
        )}

        {!loading && !error && equipment.length > 0 && (
          <div className="equipment-grid">
            {equipment.map((item) => (
              <EquipmentCard
                key={item.id}
                equipment={item}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Equipment;
