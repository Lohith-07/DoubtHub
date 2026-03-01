# DoubtHub: Central Doubt Desk

DoubtHub is an intra-college doubt discussion platform designed to streamline communication between students, faculty, and administrators. It provides a real-time, interactive environment for raising and resolving academic queries.

## Project Structure

This project is a full-stack application split into two main components:

- **[backend/](backend/README.md)**: Node.js/Express server and MongoDB database logic.
- **[frontend/](frontend/README.md)**: React/Vite/Tailwind CSS user interface.

## Key Features

- **Role-Based Access**: Specialized dashboards for Students, Faculty, and Admins.
- **Real-time Announcements**: Instant push notifications for important updates.
- **Doubt Lifecycle Management**: Create, search, tag, and resolve academic doubts.
- **Rich Interaction**: Support for markdown text and file uploads.
- **Responsive Design**: Modern, glassmorphic UI optimized for all devices.

## Tech Stack Overview

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Socket.io-client.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Multer, Socket.io.

## Getting Started

To get the entire project running locally:

### 1. Backend Setup

Navigate to the `backend` directory and follow the instructions in the [backend README](backend/README.md).

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup

Navigate to the `frontend` directory and follow the instructions in the [frontend README](frontend/README.md).

```bash
cd frontend
npm install
npm run dev
```

## Contributing

1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

