# 🚀 DoubtHub — Central Doubt Desk

DoubtHub is a full-stack academic discussion platform designed to centralize doubt resolution, resource sharing, and institutional communication within a college environment.

It provides structured doubt management, role-based dashboards, real-time notifications, and secure cloud file storage — deployed in a production-ready cloud architecture.

---

## 🌍 Live Application

- **Frontend (Netlify)**: [https://doubt-hub.netlify.app/]
- **Backend (Render)**: [https://doubthub.onrender.com]

---

## 📌 Project Vision

DoubtHub aims to replace scattered academic communication systems with a centralized, structured, and scalable platform where:

- Students can raise and track doubts
- Faculty can respond and manage academic discussions
- Admins can broadcast announcements and monitor activity
- Notes and study materials are stored securely in the cloud

---

## 🏗️ High-Level Architecture

```
Browser (Client)
       ↓
Frontend (React + Vite) — Netlify
       ↓
Backend (Node.js + Express) — Render
       ↓
MongoDB Atlas (Database + GridFS Storage)
```

---

## ✨ Core Platform Capabilities

- Role-Based Access Control (Student / Faculty / Admin)
- Structured Doubt Lifecycle Management
- Real-Time Announcements & Notifications
- Cloud-Based Notes Upload & Streaming
- JWT-Based Authentication
- Secure API Architecture
- Responsive Modern UI
- Production Deployment (Netlify + Render)

---

## 🧩 Project Structure

```
DoubtHub/
│
├── backend/     → API, database models, authentication, real-time logic
├── frontend/    → UI, routing, state management, API integration
└── README.md    → Project overview (this file)
```

Detailed implementation documentation is available in:

- `backend/README.md`
- `frontend/README.md`

---

## 🔐 Security & Production Design

- Environment variable configuration
- JWT-based secure authentication
- Role-based authorization middleware
- Protected API routes
- No sensitive credentials committed to repository
- Separate frontend/backend deployment environments

---

## ⚙️ Local Development

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Each module contains its own detailed setup guide.

---

## 🚀 Deployment Overview

- Backend deployed on Render
- Frontend deployed on Netlify
- MongoDB Atlas for cloud database
- GitHub for version control & CI/CD integration

---

## 📈 Engineering Highlights

- Full-stack cloud deployment
- Real-time bidirectional communication
- Modular architecture
- Scalable backend design
- Clean separation of concerns
- Production-grade environment configuration

---

## 🔮 Roadmap

- Advanced analytics dashboard
- AI-powered doubt classification
- Faculty auto-assignment system
- Role-based note approval workflow
- Extended notification tracking

---

## 👨‍💻 Author

**Lohith Burra**  
B.Tech CSE (Data Science)  
Full-Stack Developer | Cloud Enthusiast

---
