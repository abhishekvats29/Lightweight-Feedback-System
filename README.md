# 🚀 Lightweight Feedback System

A Full Stack Project for Lightweight Feedback System.
A structured feedback platform designed for managers and employees. 
This application supports role-based login, feedback submission, history tracking, sentiment analysis, and more.
Built using React and Flask with SQLite, and fully containerized via Docker.

---
## Core Features

🔒 Role-based Authentication (Manager, Employee)
📝 Feedback Submission: strengths, improvements, sentiment
📃 Feedback History & Timeline View
🧭 Role-specific Dashboards
🔍 Search & Filter by keywords/tags
🧾 Export Feedback to PDF
✏️ Edit/Delete Feedback (by Manager)
👀 Acknowledge Feedback (by Employee)


## 🧰 Tech Stack & Design Decisions

### Frontend:
- **React + Tailwind CSS**: Fast UI development with clean responsive design.
- **Recharts**: Visualize sentiment trends in dashboards.
- **Toastify**: Non-intrusive notifications.

### Backend:
- **Flask (Python)**: Lightweight REST API server.
- **SQLite**: Simple, file-based relational DB, easy to use and persist.
- **JWT (Flask-JWT-Extended)**: Role-based secure authentication system.

---
## ⚙️ Tech Stack

| Layer      | Tech                      |
|------------|---------------------------|
| Frontend   | React + Tailwind CSS      |
| Backend    | Python (Flask)            |
| Database   | SQLite (via `sqlite3`)    |
| Auth       | JWT (Flask-JWT-Extended)  |
| Charts     | Recharts (Frontend)       |
| Deployment | Dockerfile provided       |

---

### Architecture:
- Manager and Employee roles with access control.
- Each route modularized (`auth.py`, `feedback.py`, `dashboard.py`) for clarity.
- Frontend stored feedback (anonymous/request) in `localStorage` for simplicity and demo scope.
- Dockerized backend for consistent deployment experience.

  ## 📡 API Endpoints

| Method | Endpoint               | Description                                  | Access        |
|--------|------------------------|----------------------------------------------|---------------|
| POST   | `/api/auth/signup`     | Register a new user                          | Public        |
| POST   | `/api/auth/login`      | Login with emp_id, password, and role        | Public        |
| GET    | `/api/feedbacks`       | Get feedback for logged-in user              | Authenticated |
| POST   | `/api/feedbacks`       | Submit feedback (Manager only)               | Manager only  |
| PUT    | `/api/feedbacks/<id>`  | Edit existing feedback (Manager only)        | Manager only  |
| POST   | `/api/acknowledge/<id>`| Employee acknowledges feedback received      | Employee only |

---

## 🛠️ Setup Instructions

### ✅ Backend (Flask + SQLite)
```bash
# 1. Navigate to backend folder
cd backend
# 2. Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
# 3. Install dependencies
pip install -r requirements.txt
# 4. Run the Flask server
python app.py

### 🐳 Backend via Docker

# From backend folder
docker build -t feedback-backend .
docker run -p 5000:5000 --name feedback-app feedback-backend

### ✅ Frontend (React)

# 1. Navigate to frontend folder
cd frontend
# 2. Install dependencies
npm install
# 3. Start the app
npm run dev

## 📸 Demo Screenshot

![Demo Screenshot]
(https://github.com/your-username/your-repo-name/blob/main/assets/screenshot.png)


## 👨‍💻 Author
Abhishek Vats

## 📄 License
This project is developed as part of a Full Stack Developer Assignmnet.


