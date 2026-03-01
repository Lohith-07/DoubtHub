import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { announcementAPI } from "../services/api";
import CreateAnnouncement from "./CreateAnnouncement";
import Pagination from "../components/Pagination";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AnnouncementSkeleton } from "../components/Skeleton";

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priority, setPriority] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAnnouncements(1);
  }, [priority]);

  const fetchAnnouncements = async (targetPage = page) => {
    try {
      setLoading(true);
      const res = await announcementAPI.getAll({
        priority,
        page: targetPage,
        limit: 10,
      });
      setAnnouncements(res.data.data);
      setTotalPages(res.data.pages);
      setPage(res.data.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchAnnouncements(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementAPI.delete(id);
      setAnnouncements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const priorityStyles = {
    high: "border-red-500 bg-red-50/30 ring-red-100 shadow-red-100",
    medium: "border-amber-500 bg-amber-50/30 ring-amber-100 shadow-amber-100",
    low: "border-gray-200 bg-gray-50/30 ring-gray-100 shadow-gray-100",
  };

  const priorityBadge = {
    high: "bg-red-500 text-white",
    medium: "bg-amber-500 text-white",
    low: "bg-gray-400 text-white",
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Announcements
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with the latest campus news
          </p>
        </div>

        {(user.role === "admin" || user.role === "faculty") && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCreate(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <span>📢</span> Post Announcement
          </motion.button>
        )}
      </div>

      {/* Filter */}
      <div className="flex justify-end pt-2">
        <div className="flex items-center gap-3 bg-white/50 border border-gray-100 rounded-2xl px-6 py-2 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            Priority
          </span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer"
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <AnnouncementSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {announcements.map((ann) => (
              <motion.div
                key={ann._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass p-8 rounded-[2.5rem] border-l-8 shadow-premium relative overflow-hidden group ${priorityStyles[ann.priority]}`}
              >
                <div className="flex justify-between items-start gap-6 relative z-10">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${priorityBadge[ann.priority]}`}
                      >
                        {ann.priority} Priority
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {new Date(ann.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {ann.title}
                    </h3>
                    <div className="prose prose-sm max-w-none text-gray-600 font-medium leading-relaxed mb-4">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {ann.message}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {(user.role === "admin" ||
                    (user.role === "faculty" &&
                      (ann.createdBy?._id === user._id ||
                        ann.createdBy === user._id))) && (
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-all"
                    >
                      🗑️
                    </button>
                  )}
                </div>

                <div className="absolute top-0 right-0 w-48 h-48 bg-white/40 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {!loading && announcements.length === 0 && (
        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
          <div className="text-5xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-900">No announcements</h3>
          <p className="text-gray-500 mt-2">Check back later for updates</p>
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateAnnouncement
            onClose={() => setShowCreate(false)}
            onCreated={fetchAnnouncements}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
