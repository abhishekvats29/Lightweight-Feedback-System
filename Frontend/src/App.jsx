import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Unauthorized from "./pages/Unauthorized";
import FeedbackRequest from "./pages/FeedbackRequest";
import AnonymousFeedback from "./pages/AnonymousFeedback";
import FeedbackHistory from "./components/FeedbackHistory";

// ✅ Layout and Protected Routes
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      {/* 🔔 Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />

      {/* 🌐 App Routes */}
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔒 Protected Routes under Layout */}
        <Route element={<Layout />}>
          {/* 👨‍💼 Manager Routes */}
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedback-history"
            element={
              <ProtectedRoute role="manager">
                <FeedbackHistory />
              </ProtectedRoute>
            }
          />

          {/* 👨‍💻 Employee Routes */}
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/request-feedback"
            element={
              <ProtectedRoute role="employee">
                <FeedbackRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anonymous-feedback"
            element={
              <ProtectedRoute role="employee">
                <AnonymousFeedback />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
