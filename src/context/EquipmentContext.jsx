import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const EquipmentContext = createContext();


const API_URL = "http://localhost:3001/equipment";

export function EquipmentProvider({ children }) {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch equipment from the API
  const fetchEquipment = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch equipment.");
      }

      const data = await response.json();
      setEquipment(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Add equipment through the API
  const addEquipment = async (newEquipment) => {
    const equipmentToAdd = {
      ...newEquipment,
      price: Number(newEquipment.price),
      available: newEquipment.available ?? true,
      specifications: {
        model: newEquipment.model,
        year: Number(newEquipment.year),
        fuel: newEquipment.fuel,
        weight: newEquipment.weight,
      },
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(equipmentToAdd),
    });

    if (!response.ok) {
      throw new Error("Failed to add equipment.");
    }

    const savedEquipment = await response.json();

    setEquipment((prev) => [...prev, savedEquipment]);

    return savedEquipment;
  };

  // Delete equipment through the API
  const deleteEquipment = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete equipment.");
    }

    setEquipment((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  // Update equipment through the API
  const updateEquipment = async (id, updatedData) => {
    const existingEquipment = equipment.find(
      (item) => String(item.id) === String(id)
    );

    if (!existingEquipment) {
      throw new Error("Equipment not found.");
    }

    const updatedEquipment = {
      ...existingEquipment,
      ...updatedData,
      price: Number(updatedData.price),
      available:
        updatedData.available ?? existingEquipment.available,
      specifications: {
        ...existingEquipment.specifications,
        model: updatedData.model,
        year: Number(updatedData.year),
        fuel: updatedData.fuel,
        weight: updatedData.weight,
      },
    };

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEquipment),
    });

    if (!response.ok) {
      throw new Error("Failed to update equipment.");
    }

    const savedEquipment = await response.json();

    setEquipment((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? savedEquipment
          : item
      )
    );

    return savedEquipment;
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipment,
        loading,
        error,
        fetchEquipment,
        addEquipment,
        deleteEquipment,
        updateEquipment,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
}

export function useEquipment() {
  return useContext(EquipmentContext);
}
