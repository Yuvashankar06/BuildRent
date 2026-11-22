
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEquipment } from "../../context/EquipmentContext";
import "../../styles/ownerForm.scss";

function AddEquipment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addEquipment } = useEquipment();

  const isAdmin = location.pathname.startsWith("/admin");

  const equipmentListPath = isAdmin
    ? "/admin/equipment"
    : "/owner/equipment";

  const [formData, setFormData] = useState({
    name: "",
    category: "Excavator",
    description: "",
    price: "",
    location: "",
    model: "",
    year: "",
    fuel: "Diesel",
    weight: "",
    image: "",
    available: true,
  });

  const [customCategory, setCustomCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: value,
    }));

    if (value !== "Other") {
      setCustomCategory("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCategory =
      formData.category === "Other"
        ? customCategory.trim()
        : formData.category;

    if (!finalCategory) {
      setError("Please enter a category name.");
      return;
    }

    if (Number(formData.price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      await addEquipment({
        ...formData,
        category: finalCategory,
      });

      window.alert("Equipment added successfully!");
      navigate(equipmentListPath);
    } catch (err) {
      console.error("Error adding equipment:", err);
      setError(
        err.message || "Failed to add equipment. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="equipment-form-page">
      <div className="equipment-form-container">
        <Link to={equipmentListPath}>
          ← Back to {isAdmin ? "Equipment Management" : "My Equipment"}
        </Link>

        <span className="page-label">
          {isAdmin ? "ADMIN PANEL" : "OWNER PANEL"}
        </span>

        <h1>Add Equipment</h1>

        <p>
          Add a new construction equipment item to your rental inventory.
        </p>

        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <h3>Basic Information</h3>

          <div className="form-group">
            <label htmlFor="name">Equipment Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Excavator ZX200"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Equipment Category</label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              required
            >
              <option value="Excavator">Excavator</option>
              <option value="Crane">Crane</option>
              <option value="Loader">Loader</option>
              <option value="Bulldozer">Bulldozer</option>
              <option value="Road Roller">Road Roller</option>
              <option value="Backhoe Loader">Backhoe Loader</option>
              <option value="Concrete Equipment">
                Concrete Equipment
              </option>
              <option value="Other">+ Add New Category</option>
            </select>

            {formData.category === "Other" && (
              <div className="form-group">
                <label htmlFor="customCategory">
                  New Category Name
                </label>

                <input
                  id="customCategory"
                  type="text"
                  value={customCategory}
                  onChange={(e) =>
                    setCustomCategory(e.target.value)
                  }
                  placeholder="e.g. Concrete Mixer"
                  required
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the equipment..."
              rows="4"
              required
            />
          </div>

          <h3>Rental Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price Per Day (₹)</label>
              <input
                id="price"
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter daily rental price"
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
                placeholder="e.g. Mumbai"
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
                placeholder="e.g. ZX200"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="year">Manufacturing Year</label>
              <input
                id="year"
                type="number"
                name="year"
                min="1900"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fuel">Fuel Type</label>
              <select
                id="fuel"
                name="fuel"
                value={formData.fuel}
                onChange={handleChange}
              >
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Petrol">Petrol</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                id="weight"
                type="text"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 20 Ton"
                required
              />
            </div>
          </div>

          <h3>Equipment Image</h3>

          <div className="form-group">
            <label htmlFor="image">Image URL or Path</label>
            <input
              id="image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="/images/excavator.jpg"
            />

            <small>
              Enter a public image path or a valid image URL.
            </small>
          </div>

          <div className="form-checkbox">
            <input
              id="available"
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />

            <label htmlFor="available">
              Equipment is currently available for rental
            </label>
          </div>

          <div className="form-actions">
            <Link to={equipmentListPath}>Cancel</Link>

            <button type="submit" disabled={saving}>
              {saving ? "Adding Equipment..." : "Add Equipment"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddEquipment;
