import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-red-200">
        <h1 className="text-3xl font-extrabold text-red-600 mb-4">
          🚫 Unauthorized Access
        </h1>
        <p className="text-gray-700 mb-6 text-sm leading-relaxed">
          You do not have permission to view this page.
          <br />
          Please log in with the correct role. Trying to access manager pages as an employee or vice versa is not allowed.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 transition"
        >
          🔐 Go to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
