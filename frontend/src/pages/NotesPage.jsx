import NotesCard from "../components/NotesCard";
import CreateNotes from "./CreateNotes";
import Pagination from "../components/Pagination";
import { NoteSkeleton } from "../components/Skeleton";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../services/api";

export default function NotesPage() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotes(1);
  }, [semester]);

  const fetchNotes = async (targetPage = page) => {
    try {
      setLoading(true);
      const res = await notesAPI.getAll({
        search,
        semester,
        page: targetPage,
        limit: 9,
      });
      setNotes(res.data.data);
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
    fetchNotes(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete these notes?")) return;
    try {
      await notesAPI.delete(id);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Academic Notes
          </h1>
          <p className="text-gray-500 mt-1">Access and share study materials</p>
        </div>

        {(user?.role === "student" || user?.role === "faculty") && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <span>📤</span> Upload Notes
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-[2rem] flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="flex-1 relative w-full">
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-12 py-3 text-sm transition-all outline-none"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <button type="submit" className="hidden">
            Search
          </button>
        </form>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="bg-white/50 border border-gray-100 focus:ring-2 focus:ring-indigo-500 rounded-2xl px-6 py-3 text-sm transition-all outline-none md:w-48 appearance-none cursor-pointer"
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <NoteSkeleton key={i} />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NotesCard
                key={note._id}
                note={note}
                user={user}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-900">No notes found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <CreateNotes
            onClose={() => setShowUpload(false)}
            onUpload={fetchNotes}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
