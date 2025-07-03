import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage safely on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    try {
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
    }
  }, []);

  // ✅ Login function
  const login = (userData) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      if (userData.role === "manager") {
        localStorage.setItem("managerId", userData.id);
      } else if (userData.role === "employee") {
        localStorage.setItem("employeeId", userData.id);
      }
      setUser(userData);
    } catch (error) {
      console.error("Login failed to persist user:", error);
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("managerId");
    localStorage.removeItem("employeeId");
    setUser(null);
  };

  // ✅ Utility functions for role-based checks
  const isManager = () => user?.role === "manager";
  const isEmployee = () => user?.role === "employee";

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        isManager,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook for accessing AuthContext
export const useAuth = () => useContext(AuthContext);
