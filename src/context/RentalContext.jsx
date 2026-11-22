import React, { createContext, useContext, useState } from "react";

const RentalContext = createContext();

const initialRentals = [
  {
    id: 1,
    equipmentId: 1,
    equipment: "Excavator ZX200",
    renter: "Rahul Sharma",
    renterEmail: "rahul@gmail.com",
    startDate: "2026-09-20",
    endDate: "2026-09-25",
    days: 6,
    pricePerDay: 5000,
    totalAmount: 30000,
    status: "Approved",
  },
];

export function RentalProvider({ children }) {
  const [rentals, setRentals] = useState(initialRentals);

  // Add a new rental request
  const addRental = (rentalData) => {
    const newRental = {
      ...rentalData,
      id: Date.now(),
      status: "Pending",
    };

    setRentals((prevRentals) => [
      ...prevRentals,
      newRental,
    ]);
  };

  // Update rental status
  const updateRentalStatus = (id, status) => {
    setRentals((prevRentals) =>
      prevRentals.map((rental) =>
        rental.id === id
          ? {
              ...rental,
              status,
            }
          : rental
      )
    );
  };

  // Delete rental
  const deleteRental = (id) => {
    setRentals((prevRentals) =>
      prevRentals.filter((rental) => rental.id !== id)
    );
  };

  // Find rental by ID
  const getRentalById = (id) => {
    return rentals.find(
      (rental) => rental.id === Number(id)
    );
  };

  return (
    <RentalContext.Provider
      value={{
        rentals,
        addRental,
        updateRentalStatus,
        deleteRental,
        getRentalById,
      }}
    >
      {children}
    </RentalContext.Provider>
  );
}

export function useRental() {
  return useContext(RentalContext);
}