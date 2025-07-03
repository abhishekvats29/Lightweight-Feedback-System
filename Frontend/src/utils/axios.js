// src/utils/axios.js
import axios from "axios";

// ⚙️ Axios instance for making API calls to the Flask backend
const instance = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ matches backend
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Attach JWT token (if available) to each request
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
