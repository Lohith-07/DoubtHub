import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import AnnouncementPopup from "./components/AnnouncementPopup";
import { announcementAPI } from "./services/api";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import CreateDoubt from "./pages/CreateDoubt";
import ViewDoubt from "./pages/ViewDoubt";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import NotesPage from "./pages/NotesPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import LandingPage from "./pages/LandingPage";
import SearchResults from "./pages/SearchResults";

function App() {
  const { user, socket } = useAuth();
  const location = useLocation();
  const [activeAnnouncement, setActiveAnnouncement] = useState(null);

  useEffect(() => {
    if (socket) {
      const handleNewAnnouncement = (announcement) => {
        // Only show if relevant to user role or "all"
        if (
          announcement.targetRole === "all" ||
          announcement.targetRole === user?.role
        ) {
          setActiveAnnouncement(announcement);
        }
      };

      socket.on("newAnnouncement", handleNewAnnouncement);
      return () => socket.off("newAnnouncement", handleNewAnnouncement);
    }
  }, [socket, user]);

  // Check for unseen announcements on login/load
  useEffect(() => {
    if (user && !activeAnnouncement) {
      const checkUnseen = async () => {
        try {
          const res = await announcementAPI.getAll({ limit: 1 });
          if (res.data.data.length > 0) {
            const latest = res.data.data[0];
            const seen = localStorage.getItem(
              `seen_announcement_${latest._id}`,
            );
            if (!seen) {
              setActiveAnnouncement(latest);
            }
          }
        } catch (err) {
          console.error("Check unseen failed:", err);
        }
      };
      checkUnseen();
    }
  }, [user]);

  const closeAnnouncement = () => {
    if (activeAnnouncement) {
      localStorage.setItem(
        `seen_announcement_${activeAnnouncement._id}`,
        "true",
      );
      setActiveAnnouncement(null);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navbar Full Width */}
      <Navbar />

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />

              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<StudentDashboard />} />
                <Route path="/faculty" element={<FacultyDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/notes" element={<NotesPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/doubts/new" element={<CreateDoubt />} />
                <Route path="/doubts/:id" element={<ViewDoubt />} />
                <Route path="/faculty/doubts/:id" element={<ViewDoubt />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<SearchResults />} />
              </Route>
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <AnnouncementPopup
        announcement={activeAnnouncement}
        onClose={closeAnnouncement}
      />
    </div>
  );
}

export default App;
