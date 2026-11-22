import React from "react";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { EquipmentProvider } from "./context/EquipmentContext";
import { RentalProvider } from "./context/RentalContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <EquipmentProvider>
          <RentalProvider>
            <AppRoutes />
          </RentalProvider>
        </EquipmentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;