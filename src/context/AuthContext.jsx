import React, {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

const DEFAULT_ADMIN_EMAIL = "admin@gmail.com";

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Create or repair the default admin without duplicates.
  const [usersInitialized] = useState(() => {
    let existingUsers = [];

    try {
      existingUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      if (!Array.isArray(existingUsers)) {
        existingUsers = [];
      }
    } catch {
      existingUsers = [];
    }

    const isDefaultAdmin = (user) =>
      user.role?.toLowerCase() === "admin" &&
      (
        user.email?.toLowerCase() === "admin@gmail.com" ||
        user.email?.toLowerCase() === "admin@rentequip.com" ||
        user.email?.toLowerCase() === "admin1@equiprent.com" ||
        user.email?.toLowerCase() === "admin1@equipment.com"
      );

    const matchingAdmins = existingUsers.filter(isDefaultAdmin);

    // Keep one existing default admin, if available.
    const defaultAdmin = matchingAdmins[0]
      ? {
          ...matchingAdmins[0],
          id: matchingAdmins[0].id ?? 999999,
          name: "System Admin",
          email: DEFAULT_ADMIN_EMAIL,
          phone: matchingAdmins[0].phone || "9999999999",
          role: "admin",
          password: matchingAdmins[0].password || "admin123",
        }
      : {
          id: 999999,
          name: "System Admin",
          email: DEFAULT_ADMIN_EMAIL,
          phone: "9999999999",
          password: "admin123",
          role: "admin",
        };

    // Remove duplicate default admins, preserving all other users.
    const otherUsers = existingUsers.filter(
      (user) => !isDefaultAdmin(user)
    );

    // Avoid an email collision with a non-default account.
    const emailOwner = otherUsers.find(
      (user) =>
        user.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL
    );

    if (emailOwner) {
      console.error(
        "Cannot assign admin@gmail.com because another account already uses it."
      );

      return true;
    }

    localStorage.setItem(
      "users",
      JSON.stringify([...otherUsers, defaultAdmin])
    );

    // Update the active session if it belongs to the default admin.
    try {
      const storedSession = JSON.parse(
        localStorage.getItem("currentUser") || "null"
      );

      if (
        storedSession?.role?.toLowerCase() === "admin" &&
        (
          storedSession.email?.toLowerCase() === "admin@rentequip.com" ||
          storedSession.email?.toLowerCase() === "admin1@equiprent.com" ||
          storedSession.email?.toLowerCase() === "admin1@equipment.com" ||
          storedSession.email?.toLowerCase() === DEFAULT_ADMIN_EMAIL
        )
      ) {
        const updatedSession = {
          ...storedSession,
          name: "System Admin",
          email: DEFAULT_ADMIN_EMAIL,
          role: "admin",
        };

        localStorage.setItem(
          "currentUser",
          JSON.stringify(updatedSession)
        );
      }
    } catch {
      localStorage.removeItem("currentUser");
    }

    return true;
  });

  const registerUser = (userData) => {
    let existingUsers = [];

    try {
      existingUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      if (!Array.isArray(existingUsers)) {
        existingUsers = [];
      }
    } catch {
      existingUsers = [];
    }

    const emailExists = existingUsers.some(
      (user) =>
        user.email?.toLowerCase() ===
        userData.email.trim().toLowerCase()
    );

    if (emailExists) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email.trim(),
      phone: userData.phone,
      password: userData.password,
      role: userData.role,
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...existingUsers, newUser])
    );

    return {
      success: true,
      message: "Registration successful.",
    };
  };

  const loginUser = (email, password) => {
    let users = [];

    try {
      users = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      if (!Array.isArray(users)) {
        users = [];
      }
    } catch {
      users = [];
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email?.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(loggedInUser)
    );

    setCurrentUser(loggedInUser);

    return {
      success: true,
      user: loggedInUser,
    };
  };

  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        registerUser,
        loginUser,
        logoutUser,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}