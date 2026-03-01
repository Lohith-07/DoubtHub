# DoubtHub Frontend

The frontend for DoubtHub (Central Doubt Desk), a modern intra-college doubt discussion platform. Built with React, Vite, and Tailwind CSS.

## Features

- **Dashboard**: Role-based dashboards for students, faculty, and admins.
- **Real-time Interaction**: Socket.io integration for instant announcements and updates.
- **Rich Text Rendering**: Markdown support for doubt descriptions and discussions.
- **Responsive UI**: Sleek, mobile-friendly design using Tailwind CSS and Framer Motion.
- **Pagination**: Optimized data loading for large lists of doubts and users.

## Tech Stack

- **Framework**: React.js (Vite build tool)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State/API**: Axios for HTTP requests
- **Real-time**: Socket.io-client
- **Markdown**: React-Markdown, Remark-GFM

## Getting Started

### Prerequisites

- Node.js installed
- Backend server running (refer to `backend/README.md`)

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `frontend` root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

### Running the App

- **Development Mode**:

  ```bash
  npm run dev
  ```

- **Production Build**:
  ```bash
  npm run build
  npm run preview
  ```

## Project Structure

- `src/components/`: Reusable UI components.
- `src/pages/`: Main page-level components.
- `src/services/`: API and Socket.io service integrations.
- `src/context/`: React Context for state management (auth, etc.).
- `src/hooks/`: Custom React hooks.
- `src/utils/`: Helper functions and constants.
- `public/`: Static assets.
