# 💬 Lightweight Feedback System

A role-based feedback system that allows managers and employees to exchange, request, and manage feedback efficiently. Built using React (frontend) and Flask with SQLite (backend).

---

## 🚀 Features

- 🔐 Role-based login (Employee / Manager)
- 📝 Submit and view feedback (with optional sentiment)
- 🧾 Anonymous feedback support
- 📊 Sentiment analysis chart
- 📥 Request feedback from manager
- 🔎 Search, edit, delete feedback entries
- 📤 Export feedback as PDF (Manager)
- 🧪 Local storage support for anonymous data

---

## 🛠️ Tech Stack

**Frontend:**
- React + Tailwind CSS
- React Router, React Toastify
- Axios for API calls


## 📦 Folder Structure

Lightweight Feedback System/
│
├── frontend/ # React frontend
│ ├── src/
│ └── ...
│
├── backend/ # Flask backend
│ ├── app.py
│ ├── auth.py
│ ├── feedback.py
│ ├── dashboard.py
│ ├── models.py
│ └── ...
│
└── README.md