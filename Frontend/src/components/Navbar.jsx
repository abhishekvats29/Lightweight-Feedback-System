import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("managerId");
    localStorage.removeItem("employeeId");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-b from-blue-400 via-blue-700 to-blue-400 shadow-md border-b border-blue-700 py-3 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Title Left with animation */}
        <h1 className="text-2xl font-bold text-white uppercase tracking-wide animate-pulse">
          <Link
            to={
              user?.role === "manager"
                ? "/manager-dashboard"
                : "/employee-dashboard"
            }
          >
            📝 Feedback System
          </Link>
        </h1>

        {/* Right Section */}
        {user && (
          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white">
            <span>
              Role:{" "}
              <span className="font-semibold capitalize">{user.role}</span>
            </span>

            {user.role === "employee" && (
              <>
                <Link
                  to="/employee-dashboard"
                  className="hover:underline hover:text-white/90 transition"
                >
                  Dashboard
                </Link>
                <Link
                  to="/request-feedback"
                  className="hover:underline hover:text-white/90 transition"
                >
                  Request Feedback
                </Link>
                <Link
                  to="/anonymous-feedback"
                  className="hover:underline hover:text-white/90 transition"
                >
                  Anonymous Feedback
                </Link>
              </>
            )}

            {user.role === "manager" && (
              <Link
                to="/manager-dashboard"
                className="hover:underline hover:text-white/90 transition"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
