import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import ReactMarkdown from "react-markdown";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  positive: "#22c55e",
  neutral: "#facc15",
  negative: "#ef4444",
};

const ManagerDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    strengths: "",
    improvements: "",
    sentiment: "positive",
    tags: "",
  });
  const [editId, setEditId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const filtered = stored.filter((f) => f.manager_id === user.email);
    setFeedbacks(filtered);
  }, [user.email]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { employee_id, strengths, improvements, sentiment, tags } = formData;

    if (!employee_id || !strengths || !improvements) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      id: editId || Date.now(),
      employee_id,
      strengths,
      improvements,
      sentiment,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      acknowledged: false,
      manager_id: user.email,
    };

    let updatedFeedbacks;

    if (editId) {
      updatedFeedbacks = feedbacks.map((fb) =>
        fb.id === editId ? payload : fb
      );
      toast.success("Feedback updated successfully");
    } else {
      updatedFeedbacks = [payload, ...feedbacks];
      toast.success("Feedback submitted successfully");
    }

    setFeedbacks(updatedFeedbacks);
    localStorage.setItem("feedbacks", JSON.stringify(mergeWithStored(updatedFeedbacks)));

    setFormData({
      employee_id: "",
      strengths: "",
      improvements: "",
      sentiment: "positive",
      tags: "",
    });
    setEditId(null);
  };

  const mergeWithStored = (updated) => {
    const all = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const others = all.filter((f) => f.manager_id !== user.email);
    return [...others, ...updated];
  };

  const handleEdit = (feedback) => {
    setEditId(feedback.id);
    setFormData({
      employee_id: feedback.employee_id,
      strengths: feedback.strengths,
      improvements: feedback.improvements,
      sentiment: feedback.sentiment,
      tags: feedback.tags.join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      const updated = feedbacks.filter((fb) => fb.id !== id);
      setFeedbacks(updated);
      localStorage.setItem("feedbacks", JSON.stringify(mergeWithStored(updated)));
      toast.success("Feedback deleted");
    }
  };

  const toggleAcknowledge = (id) => {
    const updated = feedbacks.map((fb) =>
      fb.id === id ? { ...fb, acknowledged: !fb.acknowledged } : fb
    );
    setFeedbacks(updated);
    localStorage.setItem("feedbacks", JSON.stringify(mergeWithStored(updated)));
    toast.info("Acknowledgement toggled");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Manager Feedback Report", 10, 10);

    feedbacks.forEach((fb, idx) => {
      const y = 20 + idx * 50;
      doc.text(`Employee ID: ${fb.employee_id}`, 10, y);
      doc.text(`Strengths: ${fb.strengths}`, 10, y + 10);
      doc.text(`Improvements: ${fb.improvements}`, 10, y + 20);
      doc.text(`Sentiment: ${fb.sentiment}`, 10, y + 30);
      doc.text(`Tags: ${fb.tags.join(", ")}`, 10, y + 40);
    });

    doc.save("feedback-report.pdf");
    toast.success("PDF downloaded!");
  };

  const sentimentData = [
    {
      name: "Positive",
      value: feedbacks.filter((f) => f.sentiment === "positive").length,
    },
    {
      name: "Neutral",
      value: feedbacks.filter((f) => f.sentiment === "neutral").length,
    },
    {
      name: "Negative",
      value: feedbacks.filter((f) => f.sentiment === "negative").length,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-700 text-center sm:text-left">
          Feedback Form
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate("/feedback-history")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
          >
            View Feedback History
          </Button>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
          >
            Logout
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded-xl mb-10 border border-gray-200"
      >
        <div className="space-y-4">
          <InputField
            label="Employee ID"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
            placeholder="Enter Employee ID"
            required
          />
          <InputField
            label="Strengths"
            name="strengths"
            type="textarea"
            value={formData.strengths}
            onChange={handleChange}
            placeholder="Strengths (Markdown supported)"
            required
          />
          <InputField
            label="Improvements"
            name="improvements"
            type="textarea"
            value={formData.improvements}
            onChange={handleChange}
            placeholder="Improvement areas (Markdown supported)"
            required
          />
          <InputField
            label="Tags (comma separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. communication, leadership"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sentiment
            </label>
            <select
              name="sentiment"
              value={formData.sentiment}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>
        <div className="mt-6 text-right">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-base px-6 py-2 rounded-md"
          >
            {editId ? "Update Feedback" : "Submit Feedback"}
          </Button>
        </div>
      </form>

      {feedbacks.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            📊 Sentiment Summary
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {sentimentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name.toLowerCase()]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="bg-white shadow p-6 rounded-xl border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📋 Submitted Feedbacks
          </h3>
          {feedbacks.length > 0 && (
            <Button
              onClick={exportToPDF}
              className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Export as PDF
            </Button>
          )}
        </div>

        {feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback submitted yet.</p>
        ) : (
          feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="mb-6 p-5 border rounded-md shadow-sm bg-gray-50"
            >
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Employee ID:</strong> {fb.employee_id}
                </p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(fb)}
                    className="text-xs text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Manager:</strong> {fb.manager_id}
              </p>

              <div className="mb-2 mt-2">
                <p className="font-semibold text-green-600">✅ Strengths:</p>
                <ReactMarkdown>{fb.strengths}</ReactMarkdown>
              </div>

              <div className="mb-2">
                <p className="font-semibold text-red-600">⚠️ Improvements:</p>
                <ReactMarkdown>{fb.improvements}</ReactMarkdown>
              </div>

              <p className="text-sm mt-2 font-medium">
                Sentiment:{" "}
                <span
                  className={`px-2 py-1 rounded text-white ${
                    fb.sentiment === "positive"
                      ? "bg-green-500"
                      : fb.sentiment === "neutral"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                >
                  {fb.sentiment}
                </span>
              </p>

              {fb.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {fb.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={fb.acknowledged}
                    onChange={() => toggleAcknowledge(fb.id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Acknowledged
                  </span>
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
