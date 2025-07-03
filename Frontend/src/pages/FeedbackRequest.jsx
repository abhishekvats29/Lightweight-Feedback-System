import React, { useState } from "react";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { toast } from "react-toastify";

const FeedbackRequest = () => {
  const [formData, setFormData] = useState({
    to_manager: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.to_manager.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const existingRequests =
      JSON.parse(localStorage.getItem("feedbackRequests")) || [];
    const newRequest = {
      id: Date.now(),
      to_manager: formData.to_manager,
      message: formData.message,
    };
    localStorage.setItem(
      "feedbackRequests",
      JSON.stringify([...existingRequests, newRequest])
    );

    toast.success("Feedback request saved locally!");
    setFormData({ to_manager: "", message: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-3xl bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          🙋 Request Feedback
        </h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="To Manager (Email or ID)"
            name="to_manager"
            value={formData.to_manager}
            onChange={handleChange}
            placeholder="manager@example.com"
            required
          />

          <InputField
            label="Message"
            name="message"
            type="textarea"
            value={formData.message}
            onChange={handleChange}
            placeholder="Why are you requesting feedback?"
            required
          />

          <div className="flex justify-start mt-4">
            <Button
              type="submit"
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
            >
              Send Feedback Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackRequest;
