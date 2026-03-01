# 🎨 DoubtHub Frontend

This is the frontend application for DoubtHub — a role-based academic discussion and resource-sharing platform.

The frontend is responsible for rendering dashboards, managing authentication state, integrating with backend APIs, handling real-time socket communication, and providing a responsive, modern UI.

---

# 🏗️ Frontend Architecture

The application is built using React with Vite and follows a modular, feature-oriented structure.

```
frontend/
│
├── public/            → Static assets & Netlify redirects
├── src/
│   ├── components/    → Reusable UI components
│   ├── pages/         → Page-level views
│   ├── context/       → Global state (AuthContext)
│   ├── services/      → API configuration (Axios)
│   ├── hooks/         → Custom React hooks
│   ├── utils/         → Helper functions
│   ├── App.jsx        → Route definitions
│   └── main.jsx       → Entry point
│
└── vite.config.js
```

The frontend follows clean separation between:
- UI components
- Page logic
- Global state
- API communication

---

# 🔐 Authentication Flow (Client-Side)

## JWT Handling

- On login, JWT is stored in `localStorage`
- Axios interceptor attaches:
  ```
  Authorization: Bearer <token>
  ```
- Protected routes check authentication via `AuthContext`

## AuthContext Responsibilities

- Stores authenticated user state
- Manages login/logout
- Initializes socket connection
- Joins user-specific notification room

---

# 🛡 Route Protection

Implemented using a `ProtectedRoute` component.

### Behavior:
- Checks if user exists in context
- Redirects to `/login` if unauthorized
- Allows role-based conditional rendering

Role-based UI logic ensures:
- Students see student dashboard
- Faculty see faculty dashboard
- Admin sees administrative controls

---

# 🌐 API Integration Strategy

All API calls are centralized in:

```
src/services/api.js
```

## Axios Configuration

- Base URL from `VITE_API_BASE_URL`
- JSON headers by default
- Automatic token attachment
- Unified error normalization

Example:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
```

This ensures production-ready environment switching.

---

# 🔔 Real-Time Communication (Socket.io Client)

Socket connection is initialized using:

```
import.meta.env.VITE_SOCKET_URL
```

## Flow:

1. User logs in
2. Socket connects to backend
3. Client emits:
   ```
   socket.emit("join", userId)
   ```
4. Server pushes targeted updates
5. UI updates in real time

Used for:
- Announcements
- Notifications
- Live updates

---

# 📂 Notes & File Handling

- Notes metadata fetched via API
- File streaming via backend endpoint:
  ```
  /api/notes/file/:fileId
  ```
- Download links dynamically constructed using environment variables
- No direct file storage in frontend

---

# 🧭 Routing System

Uses React Router for SPA routing.

Defined in `App.jsx`.

### Netlify Production Fix

`public/_redirects` ensures:
```
/*    /index.html   200
```

This prevents 404 errors on refresh.

---

# 🎨 UI & Design System

## Styling
- Tailwind CSS utility-first design
- Consistent spacing & layout patterns
- Responsive breakpoints

## Animations
- Framer Motion for smooth transitions
- Animated dashboard cards
- Controlled interaction feedback

## Design Principles
- Clean SaaS-style UI
- Glassmorphic containers
- Soft gradients
- Role-based visual distinction

---

# 📊 Pagination & Data Handling

Pagination implemented via:
- Backend query parameters
- Frontend controlled page state
- Limit & offset logic
- Efficient re-rendering

Used in:
- Doubts listing
- Notes listing
- Admin user management

---

# ⚙️ Environment Variables

Create `.env` in frontend root:

```
VITE_API_BASE_URL=http://localhost:5001
VITE_SOCKET_URL=http://localhost:5001
```

In production, these are configured in Netlify dashboard.

---

# 🚀 Running Locally

## Install Dependencies

```bash
cd frontend
npm install
```

## Start Development Server

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

---

# 🛡 Production Considerations

- No hardcoded backend URLs
- Environment-driven configuration
- Secure token storage
- SPA routing handled properly
- Separate production & development configs

---

# 📈 Scalability Notes

- Modular component structure
- Reusable API service layer
- Global auth context for centralized state
- Optimized rendering patterns
- Clean integration with backend

---

# 🔮 Future Frontend Enhancements

- Dark mode toggle
- Notification dropdown panel
- UI theme customization
- Role-based dynamic layouts
- Advanced filtering & sorting
- Offline support
- Performance optimization via memoization

---
