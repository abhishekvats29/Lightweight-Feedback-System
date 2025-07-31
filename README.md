# Lightweight Feedback System
A Full Stack Project for Lightweight Feedback System.
A structured feedback platform designed for managers and employees. 
This application supports role-based login, feedback submission, history tracking, sentiment analysis, and more.
Built using React and Flask with SQLite, and fully containerized via Docker.

## Live Demo

👉 [Click here to view the live application] 
(https://lightweight-feedback-system-1.netlify.app/)

## Demo Screenshots

Here are a few visual highlights from the application:
![Image](https://github.com/user-attachments/assets/d469de51-32b5-402d-bbb0-666a84f0d369)

---
## Core Features

- 🔒 Role-based Authentication (Manager, Employee)
- 📝 Feedback Submission: strengths, improvements, sentiment
- 📃 Feedback History & Timeline View
- 🧭 Role-specific Dashboards
- 🔍 Search & Filter by keywords/tags
- 🧾 Export Feedback to PDF
- ✏️ Edit/Delete Feedback (by Manager)
- 👀 Acknowledge Feedback (by Employee)


## Tech Stack & Design Decisions

### Frontend:
- **React + Tailwind CSS**: Fast UI development with clean responsive design.
- **Recharts**: Visualize sentiment trends in dashboards.
- **Toastify**: Non-intrusive notifications.

### Backend:
- **Flask (Python)**: Lightweight REST API server.
- **SQLite**: Simple, file-based relational DB, easy to use and persist.
- **JWT (Flask-JWT-Extended)**: Role-based secure authentication system.

---
## Tech Stack

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

## Setup Instructions

## 🖥️ Frontend Setup (React + TailwindCSS)
#### Navigate to the frontend directory
cd frontend
#### Install dependencies
npm install
#### Start the development server
npm run dev

## Backend Setup (Flask + SQLite)

#### Navigate to the backend directory
cd backend
#### (Optional) Create and activate a virtual environment
python -m venv venv
source venv/bin/activate    # On Windows use: venv\Scripts\activate
#### Install backend dependencies
pip install -r requirements.txt
#### Run the Flask backend
python app.py

## Docker Setup (Backend Only)

#### Navigate to the backend directory
cd backend
#### Build the Docker image
docker build -t feedback-backend .
#### Run the container
docker run -p 5000:5000 --name feedback-app feedback-backend

## 📸 Demo Screenshot

- "Mobile interface demo screenshot"

![Image](https://github.com/user-attachments/assets/e6f78cfd-63f6-45cf-b36f-8fe58021999c)

- Desktop Interface View
  
Demo Screenshot of Login Page
![Image](https://github.com/user-attachments/assets/d91149e7-dae7-47b3-a85c-0aa503ee8717)

Demo Screenshot of SignUP Page
![Image](https://github.com/user-attachments/assets/940c9cb9-5d60-4020-bed6-2dd31ddb2572)

Demo Screenshot of Employee Dashboard
![Image](https://github.com/user-attachments/assets/05eee328-32a2-4ac2-99b0-159216ee3dff)

Demo Screenshot of Manager Dashboard history
![Image](https://github.com/user-attachments/assets/876ead1c-6b77-4de1-b380-6fe6d7158de0)



## 👨‍💻 Author
Abhishek Vats

## 📄 License
This project is developed as part of a Full Stack Developer Assignment.




