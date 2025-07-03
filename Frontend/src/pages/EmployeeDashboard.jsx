import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <p className="text-red-500 text-sm">Error loading markdown content.</p>;
    }
    return this.props.children;
  }
}

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const feedbackRef = useRef(null);

  const [feedbacks, setFeedbacks] = useState([]);
  const [acknowledged, setAcknowledged] = useState(false);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const storedFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const employeeFeedbacks = storedFeedbacks.filter(
      (fb) => fb.employee_id === user?.id
    );
    setFeedbacks(employeeFeedbacks);
    const anyAck = employeeFeedbacks.some((fb) => fb.acknowledged);
    setAcknowledged(anyAck);
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAcknowledge = () => {
    if (feedbacks.length === 0) {
      toast.error("No feedback found");
      return;
    }

    const firstFeedbackId = feedbacks[0].id;
    const updatedFeedbacks = feedbacks.map((fb) =>
      fb.id === firstFeedbackId ? { ...fb, acknowledged: true } : fb
    );

    const allStored = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const newAll = allStored.map((fb) =>
      fb.id === firstFeedbackId ? { ...fb, acknowledged: true } : fb
    );
    localStorage.setItem("feedbacks", JSON.stringify(newAll));

    setFeedbacks(updatedFeedbacks);
    setAcknowledged(true);
    toast.success("Feedback acknowledged!");
  };

  const handleExportPDF = async () => {
    const input = feedbackRef.current;
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("feedback.pdf");
    toast.success("Exported as PDF");
  };

  const handleCommentChange = (e, id) => {
    setComments({ ...comments, [id]: e.target.value });
  };

  const handleSubmitComment = (id) => {
    const comment = comments[id];
    if (!comment || comment.trim() === "") {
      toast.warning("Comment cannot be empty");
      return;
    }

    const updatedFeedbacks = feedbacks.map((fb) =>
      fb.id === id ? { ...fb, comment } : fb
    );

    const allStored = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const newAll = allStored.map((fb) =>
      fb.id === id ? { ...fb, comment } : fb
    );
    localStorage.setItem("feedbacks", JSON.stringify(newAll));

    setFeedbacks(updatedFeedbacks);
    toast.success("Comment submitted");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-white py-10 px-4 sm:px-6 lg:px-10">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 text-transparent bg-clip-text animate-pulse tracking-wide">
      WELCOME {user?.employee_id}
    </h2>

        <motion.div
          ref={feedbackRef}
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-indigo-600 text-center">
            💬 Your Feedback
          </h3>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500 text-center">No feedback yet.</p>
          ) : (
            feedbacks.map((fb) => (
              <motion.div
                key={fb.id}
                className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 transition-all"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-sm text-gray-600 mb-2">
                  <strong className="text-indigo-500">From:</strong> {fb.manager_id}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-indigo-700 mb-1">Strengths:</p>
                  <ErrorBoundary>
                    <ReactMarkdown>
                      {typeof fb.strengths === "string" ? fb.strengths : ""}
                    </ReactMarkdown>
                  </ErrorBoundary>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-red-500 mb-1">Areas to Improve:</p>
                  <ErrorBoundary>
                    <ReactMarkdown>
                      {typeof fb.improvements === "string" ? fb.improvements : ""}
                    </ReactMarkdown>
                  </ErrorBoundary>
                </div>

                <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
                  <span
                    className={`text-xs font-semibold rounded-full px-3 py-1 shadow-sm ${
                      fb.sentiment === "positive"
                        ? "bg-green-100 text-green-800"
                        : fb.sentiment === "neutral"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    Sentiment: {fb.sentiment}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {fb.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 text-indigo-700 text-xs px-3 py-0.5 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="block text-sm font-medium text-indigo-700 mb-1">
                    💭 Your Comment
                  </label>
                  <textarea
                    rows="2"
                    className="w-full border border-indigo-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Add your thoughts..."
                    value={comments[fb.id] || ""}
                    onChange={(e) => handleCommentChange(e, fb.id)}
                  />
                  <Button
                    onClick={() => handleSubmitComment(fb.id)}
                    className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Submit Comment
                  </Button>

                  {fb.comment && (
                    <p className="mt-2 text-sm text-indigo-600">
                      <strong>Your Comment:</strong> {fb.comment}
                    </p>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {feedbacks.length > 0 && (
          <motion.div
            className="mt-10 flex flex-wrap justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {!acknowledged ? (
              <Button
                onClick={handleAcknowledge}
                className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                Acknowledge
              </Button>
            ) : (
              <p className="text-green-700 font-semibold text-sm">
                ✅ Feedback acknowledged
              </p>
            )}

            <Button
              onClick={handleExportPDF}
              className="px-4 py-2 text-sm bg-[#7B3F00] hover:bg-[#944A1F] text-white rounded-md"
            >
              Export PDF
            </Button>

            <Button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
            >
              Logout
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
