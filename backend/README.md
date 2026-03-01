# 🧠 DoubtHub Backend

This is the backend service for DoubtHub — a structured academic doubt management platform.

The backend is responsible for authentication, role-based access control, doubt lifecycle handling, file storage (GridFS), real-time communication, and administrative operations.

---

# 🏗️ Backend Architecture

The backend follows a modular Express architecture:

```
backend/
│
├── config/          → Database configuration
├── controllers/     → Business logic
├── middleware/      → Auth, RBAC, error handling
├── models/          → Mongoose schemas
├── routes/          → API route definitions
├── utils/           → Helper utilities
├── server.js        → Entry point
└── seeder.js        → Test data generator
```

The application is structured using separation of concerns:
- Routes → define endpoints
- Controllers → implement logic
- Middleware → enforce security
- Models → define data schema

---

# 🔐 Authentication & Authorization

## JWT-Based Authentication

- Users authenticate via `/api/auth/login`
- JWT token is issued upon successful login
- Token must be sent in:
  ```
  Authorization: Bearer <token>
  ```

## Role-Based Access Control (RBAC)

Custom middleware enforces access:

- `protect` → Verifies token
- `isStudent` → Student-only routes
- `isFaculty` → Faculty-only routes
- `isAdmin` → Admin-only routes
- `isFacultyOrAdmin` → Combined access

Access logic is enforced at route level.

---

# 📌 Core Backend Features

## 1️⃣ Doubt Lifecycle Management

Handles the complete lifecycle of academic doubts:

- Create doubt
- Retrieve doubts (pagination + filtering)
- View single doubt
- Add replies (thread support)
- Assign faculty
- Update status (Pending / Answered)
- Upvote functionality
- Delete doubt (role restricted)

Pagination & filtering implemented using:
- Query parameters
- Mongoose sorting
- Skip & limit strategy

---

## 2️⃣ Notes Management (Cloud Storage via GridFS)

Instead of storing files on disk, DoubtHub uses **MongoDB GridFS**.

### Implementation Highlights:
- Multer with GridFS storage engine
- Files stored inside MongoDB
- Metadata stored in Notes collection
- File streaming using `GridFSBucket`
- Multi-file upload support
- 10MB file size limit

### Secure Streaming Endpoint:
```
GET /api/notes/file/:fileId
```

Files are streamed directly from MongoDB to client.

---

## 3️⃣ Real-Time Communication (Socket.io)

The backend initializes a Socket.io server alongside Express.

### Socket Logic:
- On connection → logs socket ID
- Users join personal notification rooms
- Admin broadcasts announcements
- Event-driven updates

Each user joins a room based on user ID:
```
socket.join(userId)
```

Allows targeted real-time notifications.

---

## 4️⃣ Announcement System

Admins can:
- Create announcements
- Broadcast instantly
- Store announcement history

Announcements trigger real-time events.

---

## 5️⃣ Notification System

- Notifications stored in database
- Linked to specific users
- Mark as read support
- Real-time push via socket

---

# 🗄️ Database Design

## Core Models

### User
- name
- email
- password (hashed)
- role (student / faculty / admin)
- department
- semester
- approved (for faculty approval flow)

### Doubt
- title
- description
- subject
- postedBy
- replies (embedded structure)
- status
- upvotes
- assignedTo
- timestamps

### Notes
- title
- subject
- semester
- department
- uploadedBy
- role
- files (GridFS file references)

### Announcement
- title
- message
- createdBy
- timestamps

### Notification
- user
- message
- read status
- timestamps

---

# ⚙️ Middleware System

## Custom Middleware Includes:

- Authentication verification
- Role validation
- Global error handler
- 404 route handler
- File upload handling
- Socket instance attachment to app

Error responses follow structured JSON format:
```
{
  success: false,
  message: "Error description"
}
```

---

# 🔍 API Structure

Base URL:
```
/api
```

Main route groups:

- `/api/auth`
- `/api/doubts`
- `/api/notes`
- `/api/announcements`
- `/api/notifications`
- `/api/admin`
- `/api/users`
- `/api/search`
- `/api/stats`

Each route maps to a dedicated controller.

---

# 🚀 Running Locally

## Install Dependencies

```bash
cd backend
npm install
```

## Configure Environment Variables

Create `.env`:

```
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=development
```

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

---

# 🛡 Production Considerations

- Uses `process.env.PORT`
- Secure JWT secret required
- MongoDB Atlas connection recommended
- CORS enabled
- No hardcoded credentials
- Supports cloud deployment (Render)

---

# 📈 Scalability Notes

- Modular route design
- Real-time event-driven architecture
- Database indexing for optimized queries
- GridFS scalable file storage
- Clean separation of concerns

---

# 🔮 Future Backend Enhancements

- Rate limiting middleware
- Input validation (Joi/Zod)
- API documentation via Swagger
- Audit logging
- Role-based analytics
- Background job processing
- Microservice-ready structure

---
