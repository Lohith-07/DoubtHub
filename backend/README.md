# DoubtHub Backend

The backend for DoubtHub (Central Doubt Desk), an intra-college doubt discussion platform. Built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: Secure user authentication using JWT and bcryptjs.
- **Doubt Management**: API endpoints for creating, viewing, and managing doubts.
- **Real-time Updates**: Socket.io integration for real-time announcements and notifications.
- **File Uploads**: Support for image/file uploads via Multer.
- **Admin/Faculty Controls**: Specific routes and controllers for administrative tasks.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-time**: Socket.io
- **Auth**: JWT (JSON Web Tokens)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` root with the following:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Seed the Database (Optional):
   ```bash
   npm run seed
   ```

### Running the Server

- **Development Mode** (with nodemon):

  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm start
  ```

## Project Structure

- `controllers/`: Logic for handling API requests.
- `models/`: Mongoose schemas for data.
- `routes/`: API route definitions.
- `middleware/`: Custom Express middleware (auth, etc.).
- `config/`: Database and other configurations.
- `uploads/`: Directory for stored file uploads.
