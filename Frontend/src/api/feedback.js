// src/api/feedback.js

// Helper: Get all feedbacks from localStorage
const getStoredFeedbacks = () => {
  const data = localStorage.getItem("feedbacks");
  return data ? JSON.parse(data) : [];
};

// Helper: Save feedbacks to localStorage
const setStoredFeedbacks = (feedbacks) => {
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
};

// Unique ID generator
const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

// ======================
// Manager-related APIs
// ======================

// 📥 Create Feedback (Manager)
export const createFeedback = async (feedbackData) => {
  const feedbacks = getStoredFeedbacks();
  const newFeedback = {
    id: generateId(),
    ...feedbackData,
    createdAt: new Date().toISOString(),
    acknowledged: false,
    comments: [],
  };
  feedbacks.push(newFeedback);
  setStoredFeedbacks(feedbacks);
  return newFeedback;
};

// 📜 Get all feedbacks submitted by a manager
export const getManagerFeedbacks = async (managerId) => {
  const feedbacks = getStoredFeedbacks();
  return feedbacks.filter((fb) => fb.managerId === managerId);
};

// ✏️ Update Feedback by ID
export const updateFeedback = async (id, updatedData) => {
  const feedbacks = getStoredFeedbacks();
  const updatedFeedbacks = feedbacks.map((fb) =>
    fb.id === id ? { ...fb, ...updatedData } : fb
  );
  setStoredFeedbacks(updatedFeedbacks);
  return updatedFeedbacks.find((fb) => fb.id === id);
};

// 🗑️ Delete Feedback by ID
export const deleteFeedback = async (id) => {
  const feedbacks = getStoredFeedbacks();
  const filtered = feedbacks.filter((fb) => fb.id !== id);
  setStoredFeedbacks(filtered);
  return { success: true };
};

// =======================
// Employee-related APIs
// =======================

// 📥 Get feedbacks received by an employee
export const getEmployeeFeedbacks = async (employeeId) => {
  const feedbacks = getStoredFeedbacks();
  return feedbacks.filter((fb) => fb.employeeId === employeeId);
};

// ✅ Toggle acknowledgement status for a feedback
export const toggleAcknowledgeFeedback = async (id) => {
  const feedbacks = getStoredFeedbacks();
  const updatedFeedbacks = feedbacks.map((fb) =>
    fb.id === id ? { ...fb, acknowledged: !fb.acknowledged } : fb
  );
  setStoredFeedbacks(updatedFeedbacks);
  return updatedFeedbacks.find((fb) => fb.id === id);
};

// 💬 Add a comment to feedback (Employee)
export const submitFeedbackComment = async (id, comment) => {
  const feedbacks = getStoredFeedbacks();
  const updatedFeedbacks = feedbacks.map((fb) => {
    if (fb.id === id) {
      return {
        ...fb,
        comments: [...(fb.comments || []), comment],
      };
    }
    return fb;
  });
  setStoredFeedbacks(updatedFeedbacks);
  return updatedFeedbacks.find((fb) => fb.id === id);
};
