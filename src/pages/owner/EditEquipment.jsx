
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEquipment } from "../../context/EquipmentContext";
import "../../styles/ownerForm.scss";

function EditEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    equipment,
    loading,
    error,
    updateEquipment,
  } = useEquipment();

  const isAdmin = location.pathname.startsWith("/admin");
  const equipmentListPath = isAdmin
    ? "/admin/equipment"
    : "/owner/equipment";

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    location: "",
    model: "",
    year: "",
    fuel: "",
    weight: "",
    image: "",
    available: true,
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Match IDs as strings because JSON Server may generate string IDs.
  const item = equipment.find(
    (equipmentItem) => String(equipmentItem.id) === String(id)
  );

  useEffect(() => {
    if (!item) return;

    setFormData({
      name: item.name || "",
      category: item.category || "",
      description: item.description || "",
      price: item.price ?? "",
      location: item.location || "",
      model: item.specifications?.model || "",
      year: item.specifications?.year ?? "",
      fuel: item.specifications?.fuel || "",
      weight: item.specifications?.weight || "",
      image: item.image || "",
      available: item.available ?? true,
    });
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");

    try {
      await updateEquipment(id, formData);
      window.alert("Equipment updated successfully!");
      navigate(equipmentListPath);
    } catch (err) {
      console.error("Failed to update equipment:", err);
      setSaveError(err.message || "Unable to update equipment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="equipment-form-page">
        <p>Loading equipment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="equipment-form-page">
        <h2>Unable to load equipment</h2>
        <p>{error}</p>
        <button onClick={() => navigate(equipmentListPath)}>
          Back to Equipment
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="equipment-form-page">
        <h2>Equipment not found</h2>
        <p>
          No equipment record matches ID: <strong>{id}</strong>
        </p>
        <button onClick={() => navigate(equipmentListPath)}>
          Back to Equipment
        </button>
      </div>
    );
  }

  return (
    <div className="equipment-form-page">
      <div className="equipment-form-container">
        <h1>Edit Equipment</h1>
        <p>Update the equipment information below.</p>

        {saveError && <p role="alert">{saveError}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Equipment Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price per Day</label>
              <input
                id="price"
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <h3>Specifications</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                id="model"
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                id="year"
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fuel">Fuel Type</label>
              <input
                id="fuel"
                type="text"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                id="weight"
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              id="image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          <div className="form-checkbox">
            <input
              id="available"
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            <label htmlFor="available">Equipment Available</label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              disabled={saving}
              onClick={() => navigate(equipmentListPath)}
            >
              Cancel
            </button>

            <button type="submit" disabled={saving}>
              {saving ? "Updating..." : "Update Equipment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEquipment;
