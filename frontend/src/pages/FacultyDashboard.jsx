import DoubtCard from "../components/DoubtCard";
import Pagination from "../components/Pagination";
import { statsAPI, doubtAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function FacultyDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const feedRef = useRef(null);
  const [doubts, setDoubts] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const filter = searchParams.get("filter") || "assigned";
  const search = searchParams.get("search") || "";
  const tagFilter = searchParams.get("tag") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalDoubts, setTotalDoubts] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { user } = useAuth();

  const setFilter = (val) => {
    setSearchParams((prev) => {
      prev.set("filter", val);
      return prev;
    });
    setPage(1);
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const res = await statsAPI.getDashboard();
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats fetch failed:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchDoubts = async (targetPage = page) => {
    try {
      setLoading(true);
      let params = { limit: 8, page: targetPage };

      if (search.trim()) params.search = search;
      if (filter === "assigned") params.assignedTo = user._id;
      else if (filter === "pending") {
        params.assignedTo = user._id;
        params.status = "pending";
      } else if (filter === "answered") {
        params.assignedTo = user._id;
        params.status = "answered";
      }
      if (tagFilter) params.tag = tagFilter;

      const res = await doubtAPI.getAll(params);
      setDoubts(res.data.data);
      setTotalDoubts(res.data.total);
      setPages(res.data.pages);
      setPage(res.data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user._id]);

  useEffect(() => {
    fetchDoubts(page);
  }, [filter, search, tagFilter, user._id]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchDoubts(newPage);
    feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Local filtering is no longer needed as we fetch by filter
  const filtered = doubts;

  return (
    <div className="space-y-10">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-800 text-white p-10 md:p-14 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Hello, {user.name} <br />
              <span className="text-indigo-200 text-2xl md:text-3xl font-bold opacity-80">
                Your Teaching Hub
              </span>
            </h1>

            <p className="text-lg text-indigo-100/90 font-medium max-w-lg mb-4">
              Monitor, assign, and resolve student doubts efficiently.
            </p>
            <div className="flex items-center gap-3 text-sm text-indigo-200/80 bg-black/10 w-fit px-4 py-2 rounded-xl border border-white/5">
              <span className="font-bold text-white">{user.name}</span>
              {user.department && (
                <>
                  <span className="opacity-30">|</span>{" "}
                  <span>{user.department}</span>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 flex items-center justify-center text-7xl shadow-inner animate-fade-in">
              🎓
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-100/50 animate-pulse rounded-3xl"
            />
          ))
        ) : stats ? (
          <>
            <StatCard {...stats.primary} id="stat-primary" />
            <StatCard {...stats.secondary} id="stat-secondary" />
            <StatCard {...stats.tertiary} id="stat-tertiary" />
            <StatCard {...stats.quaternary} id="stat-quaternary" />
          </>
        ) : null}
      </div>

      {/* PENDING ALERT */}
      <AnimatePresence>
        {!loading && stats?.extra?.pending > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onClick={() => setFilter("pending")}
            className="p-5 bg-amber-50 border border-amber-200 rounded-2xl cursor-pointer hover:bg-amber-100 transition-all duration-200 shadow-sm relative overflow-hidden group mb-10"
          >
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-amber-200/20"
            />
            <div className="relative z-10">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                {stats.extra.pending} doubt{stats.extra.pending > 1 ? "s" : ""}{" "}
                awaiting your response
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Click to view pending doubts
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER TABS - Premium Glass */}
      <div className="glass rounded-2xl p-3 shadow-premium border-white/40">
        <div className="flex flex-wrap gap-3">
          {["all", "assigned", "pending", "answered"].map((val) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                filter === val
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "bg-white/50 text-gray-500 hover:bg-white hover:text-gray-900"
              }`}
            >
              {val === "assigned" ? "My Queue" : val}

              {val !== "all" && (
                <span
                  className={`ml-2 px-1.5 py-0.5 rounded-md text-[10px] ${
                    filter === val
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {val === "assigned" && stats?.assigned}
                  {val === "pending" && stats?.pending}
                  {val === "answered" && stats?.answered}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100/50 animate-pulse rounded-3xl"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 bg-red-50 rounded-[2.5rem] border border-red-100 glass">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass rounded-[3rem] p-16 text-center border-white/40">
          <div className="text-6xl mb-6">📖</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No doubts in this category
          </h2>
          <p className="text-gray-500 font-medium">
            New doubts will appear here for your review and resolution.
          </p>
        </div>
      ) : (
        <div ref={feedRef} className="space-y-6">
          {/* ... existing code ... */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((doubt) => (
                <DoubtCard key={doubt._id} doubt={doubt} />
              ))}
            </AnimatePresence>
          </motion.div>

          <Pagination
            currentPage={page}
            totalPages={pages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, id }) {
  const colorMap = {
    indigo: "from-indigo-50 to-white text-indigo-600 border-indigo-100",
    emerald: "from-emerald-50 to-white text-emerald-600 border-emerald-100",
    orange: "from-orange-50 to-white text-orange-600 border-orange-100",
    purple: "from-purple-50 to-white text-purple-600 border-purple-100",
  };

  return (
    <div
      id={id}
      className={`p-6 rounded-3xl bg-gradient-to-br border ${colorMap[color]} shadow-soft hover:shadow-lg transition-all duration-300 group`}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
            {label}
          </p>
          <h2 className="text-2xl font-black">{value}</h2>
        </div>
      </div>
    </div>
  );
}
