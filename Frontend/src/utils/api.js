import axios from "./axios"; // ✅ Assuming this is set up with base URL

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // ✅ match your Flask backend
});


// 🔐 LOGIN
export const loginUser = async (emp_id, password, role) => {
  const response = await axios.post("/auth/login", {
    emp_id,
    password,
    role
  });
  return response.data;
};

// 📝 SIGNUP
export const registerUser = async (userData) => {
  const response = await axios.post("/auth/signup", {
    name: userData.name,
    emp_id: userData.emp_id,  // ✅ match backend
    password: userData.password,
    role: userData.role,
    department: userData.department,
  });
  return response.data;
};



















// Update Feedback
export const updateFeedback = async (id, data) => {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  const updatedFeedbacks = feedbacks.map((fb) =>
    fb.id === id ? { ...fb, ...data } : fb
  );

  localStorage.setItem("feedbacks", JSON.stringify(updatedFeedbacks));
  return updatedFeedbacks.find((fb) => fb.id === id);
};

// Delete Feedback
export const deleteFeedback = async (id) => {
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  const filtered = feedbacks.filter((fb) => fb.id !== id);
  localStorage.setItem("feedbacks", JSON.stringify(filtered));

  return { success: true };
};

// Get All Feedbacks
export const getAllFeedbacks = () => {
  return JSON.parse(localStorage.getItem("feedbacks")) || [];
};

// Get Feedbacks by Manager ID
export const getManagerFeedbacks = (managerId) => {
  return getAllFeedbacks().filter((fb) => fb.manager_id === managerId);
};

// Get Feedbacks by Employee ID
export const getEmployeeFeedbacks = (employeeId) => {
  return getAllFeedbacks().filter((fb) => fb.employee_id === employeeId);
};

// Create New Feedback
export const createFeedback = async (data) => {
  const feedbacks = getAllFeedbacks();
  const newFeedback = {
    id: "fb-" + Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
    acknowledged: false,
    comments: [],
  };

  feedbacks.push(newFeedback);
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  return newFeedback;
};

// Acknowledge Feedback
export const toggleAcknowledge = async (id) => {
  const feedbacks = getAllFeedbacks();
  const updated = feedbacks.map((fb) =>
    fb.id === id ? { ...fb, acknowledged: !fb.acknowledged } : fb
  );
  localStorage.setItem("feedbacks", JSON.stringify(updated));
  return updated.find((fb) => fb.id === id);
};

// Submit Comment to Feedback
export const submitComment = async (id, commentText, commenterId) => {
  const feedbacks = getAllFeedbacks();
  const updated = feedbacks.map((fb) => {
    if (fb.id === id) {
      const comment = {
        text: commentText,
        by: commenterId,
        date: new Date().toISOString(),
      };
      return {
        ...fb,
        comments: [...(fb.comments || []), comment],
      };
    }
    return fb;
  });
  localStorage.setItem("feedbacks", JSON.stringify(updated));
  return updated.find((fb) => fb.id === id);
};
