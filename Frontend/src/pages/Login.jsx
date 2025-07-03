import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { loginUser } from "../utils/api";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emp_id: "",
    password: "",
    role: "employee",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { emp_id, password, role } = formData;

    if (!emp_id || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(emp_id, password, role);

      const user = {
        token: data.token,
        id: data.id,
        role: data.role,
      };

      localStorage.setItem("user", JSON.stringify(user));
      login(user);
      toast.success("Login successful");

      navigate(role === "manager" ? "/manager-dashboard" : "/employee-dashboard");
    } catch (error) {
      const status = error.response?.status;

      if (status === 403) {
        toast.error("Role mismatch. Redirecting to unauthorized...");
        navigate("/unauthorized");
      } else {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-3xl flex w-full max-w-4xl overflow-hidden">
        {/* Left Side */}
        <div className="w-2/5 bg-blue-600 text-white p-8 flex flex-col justify-center items-center">
          <h2 className="text-4xl font-bold mb-4 animate-pulse">Welcome Back!</h2>
          <p className="text-sm text-blue-100 text-center mb-6 px-2">
            Log in to access the feedback dashboard and collaborate better.
          </p>
          <img
            src="https://www.svgrepo.com/show/503859/login.svg"
            alt="Login Illustration"
            className="w-36"
          />
        </div>

        {/* Right Side */}
        <form
          onSubmit={handleSubmit}
          className="w-3/5 bg-white p-8 flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Login to Your Account
          </h2>

          <InputField
            label="Employee ID"
            name="emp_id"
            type="text"
            value={formData.emp_id}
            onChange={handleChange}
            placeholder="Enter your ID (e.g., user123)"
            required
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <Button
            type="submit"
              className={`w-full text-white transition-colors duration-300 ${
              loading
                ? "bg-green-400 hover:bg-green-500"
                : "bg-blue-600 hover:bg-blue-500"
              }`}
              disabled={loading}
          >
          {loading ? "Logging in..." : "Login"}
          </Button>



          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
