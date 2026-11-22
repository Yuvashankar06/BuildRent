import React from "react";
import { useEquipment } from "../../context/EquipmentContext";
import { Link } from "react-router-dom";
import "../../styles/adminEquipment.scss";

function AdminEquipment() {
  const { equipment, loading, error, deleteEquipment } = useEquipment();


console.log("Admin equipment:", equipment);
console.log("Loading:", loading);
console.log("Error:", error);

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteEquipment(id);
      window.alert("Equipment deleted successfully.");
    } catch (error) {
      console.error("Error deleting equipment:", error);
      window.alert("Unable to delete equipment. Please try again.");
    }
  };

  const availableCount = equipment.filter(
    (item) => item.available === true,
  ).length;

  const unavailableCount = equipment.length - availableCount;

  return (
    <section className="admin-equipment">
      <div className="admin-page-header">
        <div>
          <span>ADMIN PANEL</span>
          <h1>Equipment Management</h1>
          <p>Manage all construction equipment listed on the platform.</p>
        </div>

        <Link to="/admin/equipment/add" className="admin-add-equipment-btn">
          + Add Equipment
        </Link>
       
      </div>

      <div className="equipment-summary">
        <div className="equipment-summary-card">
          <span>Total Equipment</span>
          <strong>{equipment.length}</strong>
        </div>

        <div className="equipment-summary-card">
          <span>Available</span>
          <strong>{availableCount}</strong>
        </div>

        <div className="equipment-summary-card">
          <span>Unavailable</span>
          <strong>{unavailableCount}</strong>
        </div>
      </div>
    <p>Equipment loaded: {equipment.length}</p>
      <div className="admin-equipment-card">
        {loading ? (
          <p>Loading equipment...</p>
        ) : error ? (
          <p>{error}</p>
        ) : equipment.length === 0 ? (
          <div className="empty-equipment">
            <h3>No equipment found</h3>
            <p>Equipment added to the platform will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Price / Day</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="equipment-name-cell">
                        <img src={item.image} alt={item.name} />

                        <div>
                          <strong>{item.name}</strong>
                          <span>
                            {item.specifications?.model ||
                              "Model not available"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>{item.category || "—"}</td>
                    <td>{item.location || "—"}</td>

                    <td>₹{Number(item.price || 0).toLocaleString("en-IN")}</td>

                    <td>
                      <span
                        className={`availability-badge ${
                          item.available ? "available" : "unavailable"
                        }`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="equipment-actions">
                        <Link
                          to={`/admin/equipment/edit/${item.id}`}
                          className="admin-edit-btn"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="admin-delete-btn"
                          onClick={() => handleDelete(item.id, item.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminEquipment;
