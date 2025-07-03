import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { toast } from "react-toastify";

const AnonymousFeedback = () => {
  const [formData, setFormData] = useState({
    to_employee: "",
    strengths: "",
    improvements: "",
    sentiment: "positive",
  });

  const [feedbackList, setFeedbackList] = useState([]);

  // Load existing feedbacks from localStorage
  useEffect(() => {
    const storedFeedbacks = JSON.parse(localStorage.getItem("anonymousFeedbacks")) || [];
    setFeedbackList(storedFeedbacks);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.strengths.trim() || !formData.improvements.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      ...formData,
    };

    const updatedFeedbacks = [...feedbackList, newFeedback];
    localStorage.setItem("anonymousFeedbacks", JSON.stringify(updatedFeedbacks));
    setFeedbackList(updatedFeedbacks);

    toast.success("Anonymous feedback submitted!");

    setFormData({
      to_employee: "",
      strengths: "",
      improvements: "",
      sentiment: "positive",
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          🕵️ Anonymous Feedback
        </h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="To (optional Employee ID or Team)"
            name="to_employee"
            value={formData.to_employee}
            onChange={handleChange}
            placeholder="Leave blank for anonymous"
          />

          <InputField
            label="Strengths"
            name="strengths"
            type="textarea"
            value={formData.strengths}
            onChange={handleChange}
            placeholder="What went well?"
            required
          />

          <InputField
            label="Areas to Improve"
            name="improvements"
            type="textarea"
            value={formData.improvements}
            onChange={handleChange}
            placeholder="Suggestions for improvement"
            required
          />

          <div className="mb-4">
            <label
              htmlFor="sentiment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sentiment
            </label>
            <select
              id="sentiment"
              name="sentiment"
              value={formData.sentiment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          <div className="flex justify-start mt-4">
            <Button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Submit Anonymous Feedback
            </Button>
          </div>
        </form>
      </div>

      {/* Feedback Cards */}
      {feedbackList.length > 0 && (
        <div className="w-full max-w-4xl grid gap-4 grid-cols-1 sm:grid-cols-2 px-2">
          {feedbackList.map((fb) => (
            <div key={fb.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="mb-2 text-sm text-gray-500">
                <strong>To:</strong> {fb.to_employee || "Anonymous"}
              </div>
              <div className="mb-2">
                <strong className="text-green-600">Strengths:</strong>
                <p className="text-gray-700">{fb.strengths}</p>
              </div>
              <div className="mb-2">
                <strong className="text-red-600">Improvements:</strong>
                <p className="text-gray-700">{fb.improvements}</p>
              </div>
              <div className="text-sm text-gray-600">
                <strong>Sentiment:</strong> {fb.sentiment}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnonymousFeedback;
