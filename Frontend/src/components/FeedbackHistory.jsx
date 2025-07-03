import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  positive: "#22c55e",
  neutral: "#facc15",
  negative: "#ef4444",
};

const FeedbackHistory = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeedbacks = () => {
      setLoading(true);
      try {
        const allFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        let relevantFeedbacks = [];

        if (user?.role === "manager") {
          relevantFeedbacks = allFeedbacks.filter(
            (fb) => fb.manager_id === user.email
          );
        } else if (user?.role === "employee") {
          relevantFeedbacks = allFeedbacks.filter(
            (fb) => fb.employee_id === user.id
          );
        }

        setFeedbacks(relevantFeedbacks);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.email || user?.id) {
      fetchFeedbacks();
    }
  }, [user]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const allFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
      const updated = allFeedbacks.filter((fb) => fb.id !== id);
      localStorage.setItem("feedbacks", JSON.stringify(updated));

      const filtered = updated.filter((fb) =>
        user.role === "manager"
          ? fb.manager_id === user.email
          : fb.employee_id === user.id
      );
      setFeedbacks(filtered);
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handleEdit = (id) => {
    alert("Edit feature not implemented yet for history view.");
    // Future: open modal or navigate to edit form
  };

  const sentimentData = [
    {
      name: "Positive",
      value: feedbacks.filter((fb) => fb.sentiment === "positive").length,
    },
    {
      name: "Neutral",
      value: feedbacks.filter((fb) => fb.sentiment === "neutral").length,
    },
    {
      name: "Negative",
      value: feedbacks.filter((fb) => fb.sentiment === "negative").length,
    },
  ];

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const searchKey =
      user.role === "manager" ? fb.employee_id : fb.manager_id;
    return searchKey?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Feedback History</h1>
        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          ← Back
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <input
          type="text"
          placeholder={
            user.role === "manager"
              ? "Search by Employee ID"
              : "Search by Manager Email"
          }
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm"
        />

        <div className="flex items-center justify-center w-full md:w-1/2">
          <PieChart width={200} height={200}>
            <Pie
              data={sentimentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label
            >
              {sentimentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[entry.name.toLowerCase()] ||
                    `hsl(${index * 60}, 70%, 50%)`
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading feedbacks...</p>
      ) : filteredFeedbacks.length === 0 ? (
        <p className="text-gray-500 text-center">No feedbacks found.</p>
      ) : (
        filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="mb-6 p-5 border rounded-md shadow-sm bg-white"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 mb-1">
                <strong>Employee ID:</strong> {fb.employee_id}
              </p>
              {user.role === "manager" && (
                <div className="space-x-3">
                  <button
                    onClick={() => handleEdit(fb.id)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(fb.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <strong>Manager:</strong> {fb.manager_id}
            </p>

            <div className="mt-3">
              <p className="font-semibold text-green-600">✅ Strengths:</p>
              <ReactMarkdown>{fb.strengths}</ReactMarkdown>
            </div>
            <div className="mt-3">
              <p className="font-semibold text-red-600">⚠️ Improvements:</p>
              <ReactMarkdown>{fb.improvements}</ReactMarkdown>
            </div>

            <p className="text-sm mt-3 font-medium">
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

            {fb.tags?.length > 0 && (
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

            <p className="text-sm mt-2">
              Acknowledged:{" "}
              <span
                className={fb.acknowledged ? "text-green-600" : "text-red-500"}
              >
                {fb.acknowledged ? "Yes" : "No"}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackHistory;
