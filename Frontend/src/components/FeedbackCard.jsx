import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

const FeedbackCard = ({ feedback, refreshFeedbacks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...feedback });
  const [loading, setLoading] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedFeedback = {
        ...editData,
        tags: typeof editData.tags === "string"
          ? editData.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : editData.tags || [],
      };

      const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
      const updatedList = feedbacks.map((fb) =>
        fb.id === feedback.id ? { ...fb, ...updatedFeedback } : fb
      );
      localStorage.setItem("feedbacks", JSON.stringify(updatedList));

      refreshFeedbacks();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update feedback", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    setLoading(true);
    try {
      const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
      const filtered = feedbacks.filter((fb) => fb.id !== feedback.id);
      localStorage.setItem("feedbacks", JSON.stringify(filtered));

      refreshFeedbacks();
    } catch (err) {
      console.error("Failed to delete feedback", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 border rounded-md shadow-sm bg-gray-50">
      {isEditing ? (
        <>
          <input
            type="text"
            name="employee_id"
            value={editData.employee_id}
            onChange={handleEditChange}
            className="border px-3 py-2 w-full mb-2 rounded"
            placeholder="Employee ID"
          />
          <textarea
            name="strengths"
            value={editData.strengths}
            onChange={handleEditChange}
            className="border px-3 py-2 w-full mb-2 rounded"
            placeholder="Strengths"
          />
          <textarea
            name="improvements"
            value={editData.improvements}
            onChange={handleEditChange}
            className="border px-3 py-2 w-full mb-2 rounded"
            placeholder="Improvements"
          />
          <input
            type="text"
            name="tags"
            value={
              Array.isArray(editData.tags) ? editData.tags.join(", ") : editData.tags || ""
            }
            onChange={handleEditChange}
            className="border px-3 py-2 w-full mb-2 rounded"
            placeholder="Tags (comma separated)"
          />
          <select
            name="sentiment"
            value={editData.sentiment}
            onChange={handleEditChange}
            className="border px-3 py-2 w-full mb-4 rounded"
          >
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Employee ID:</strong> {feedback.employee_id}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <strong>Manager:</strong> {feedback.manager_id}
          </p>

          <div className="mb-2 mt-2">
            <p className="font-semibold text-green-600">✅ Strengths:</p>
            <ReactMarkdown>
              {feedback.strengths || "No strengths provided."}
            </ReactMarkdown>
          </div>

          <div className="mb-2">
            <p className="font-semibold text-red-600">⚠️ Improvements:</p>
            <ReactMarkdown>
              {feedback.improvements || "No improvements provided."}
            </ReactMarkdown>
          </div>

          <p className="text-sm mt-2 font-medium">
            Sentiment:{" "}
            <span
              className={`px-2 py-1 rounded text-white ${
                feedback.sentiment === "positive"
                  ? "bg-green-500"
                  : feedback.sentiment === "neutral"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {feedback.sentiment}
            </span>
          </p>

          {feedback.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {feedback.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-3 py-1 rounded-md"
              disabled={loading}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-3 py-1 rounded-md"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackCard;
