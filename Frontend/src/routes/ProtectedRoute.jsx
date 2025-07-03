import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role → redirect to unauthorized
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in and role matches (or no role restriction)
  return children;
};

export default ProtectedRoute;
