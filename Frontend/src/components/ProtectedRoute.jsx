import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * A wrapper to protect routes based on login status and user role.
 *
 * @param {ReactNode} children - The component to render if access is allowed.
 * @param {string[]} allowedRoles - Optional array of allowed roles (e.g., ['manager', 'employee']).
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, setUser } = useAuth();

  // Optional: hydrate user from localStorage on refresh
  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, [user, setUser]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
