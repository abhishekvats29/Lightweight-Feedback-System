import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { registerUser } from "../utils/api";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    emp_id: "",
    password: "",
    department: "",
    role: "employee",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, emp_id, password, department, role } = formData;

    if (!name || !emp_id || !password || !department || !role) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await registerUser(formData);
      toast.success("Signup successful");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl flex w-full max-w-4xl overflow-hidden scale-95">
        {/* Welcome Section */}
        <div className="w-2/5 bg-blue-600 text-white p-8 flex flex-col justify-center items-center rounded-l-3xl">
          <h2 className="text-5xl font-bold mb-4 animate-pulse">Welcome!</h2>
          <p className="text-sm text-blue-100 text-center mb-6 px-2">
            Join the feedback system and collaborate efficiently with your team.
          </p>
          <img
            src="https://www.svgrepo.com/show/497472/add-user.svg"
            alt="Signup Illustration"
            className="w-40"
          />
        </div>

        {/* Signup Form Section */}
        <form
          onSubmit={handleSubmit}
          className="w-3/5 bg-white p-8 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Create Your Account
          </h2>

          <InputField
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />

          <InputField
            label="Employee ID"
            name="emp_id"
            type="text"
            value={formData.emp_id}
            onChange={handleChange}
            placeholder="e.g., emp001"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2 text-sm text-blue-600"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <InputField
            label="Department"
            name="department"
            type="text"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter your department"
            required
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <Button
            type="submit"
            className={`w-full text-white transition-colors duration-300 cursor-pointer ${
            loading
              ? "bg-green-400 hover:bg-green-500"
              : "bg-blue-600 hover:bg-blue-500"
            }`}
            disabled={loading}
            style={{ pointerEvents: loading ? "none" : "auto" }}
          >
          {loading ? "Signing up..." : "Signup"}
          </Button>


          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-500 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
