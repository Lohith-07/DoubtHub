import DoubtCard from "../components/DoubtCard";
import Pagination from "../components/Pagination";
import { statsAPI, doubtAPI } from "../services/api";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const feedRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalDoubts, setTotalDoubts] = useState(0);

  const [statusFilter, setStatusFilter] = useState("all");
  const search = searchParams.get("search") || "";
  const filter = searchParams.get("filter") || "all";
  const tagFilter = searchParams.get("tag") || "";
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const limit = 6;

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await statsAPI.getDashboard();
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoubts(page);
  }, [search, filter, tagFilter, sort]);

  const fetchDoubts = async (targetPage = page) => {
    try {
      setLoading(true);

      const params = { page: targetPage, limit, sort };
      if (search.trim()) params.search = search;
      if (filter === "my") params.my = "true";
      if (tagFilter) params.tag = tagFilter;

      const res = await doubtAPI.getAll(params);

      setDoubts(res.data.data);
      setPages(res.data.pages);
      setTotalDoubts(res.data.total);
      setPage(res.data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchDoubts(newPage);
    feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchParams((prev) => {
      if (val) prev.set("search", val);
      else prev.delete("search");
      return prev;
    });
    setPage(1);
  };

  const filtered =
    statusFilter === "all"
      ? doubts
      : doubts.filter((d) => d.status === statusFilter);

  return (
    <div className="space-y-10">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-10 md:p-14 shadow-2xl"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Welcome back, {user.name} <br />
              <span className="text-indigo-200 text-2xl md:text-3xl font-bold opacity-80">
                Ready to master your subjects?
              </span>
            </h1>

            <p className="text-lg text-indigo-100/90 font-medium max-w-lg mb-8">
              Post your academic doubts and get them resolved by our experienced
              faculty members.
            </p>

            <Link
              to="/doubts/new"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-2xl text-base font-bold shadow-xl hover:scale-105 hover:shadow-indigo-500/25 transition-all active:scale-95"
            >
              <span>+</span> Ask a New Doubt
            </Link>
          </div>

          <motion.div
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="hidden lg:block shadow-2xl rounded-[2.5rem]"
          >
            <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 flex items-center justify-center text-7xl shadow-inner">
              📚
            </div>
          </motion.div>
        </div>
      </motion.div>

     

      {/* MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-12 gap-10">
        {/* FEED (Left/Center) */}
        <div ref={feedRef} className="lg:col-span-8 space-y-8">
          {/* FILTER BAR - Premium Glass */}
          <div className="glass rounded-2xl p-3 flex items-center justify-between gap-4 border-white/40">
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "answered"].map((val) => (
                <button
                  key={val}
                  onClick={() => setStatusFilter(val)}
                  className={`px-5 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                    statusFilter === val
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white/50 text-gray-500 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-white/50 border border-white/60 text-[11px] font-bold uppercase tracking-wider outline-none focus:bg-white transition-all cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="upvotes">Most Popular</option>
            </select>
          </div>

          {/* ACTIVE FILTER INDICATOR */}
          {(search || tagFilter) && (
            <div className="flex items-center gap-3 px-2">
              <span className="text-xs text-gray-500">
                Found {totalDoubts} results for
                {search && (
                  <span className="font-bold text-gray-900"> "{search}"</span>
                )}
                {tagFilter && (
                  <span className="font-bold text-indigo-600">
                    {" "}
                    #{tagFilter}
                  </span>
                )}
              </span>
              <button
                onClick={() => {
                  setSearchParams({});
                  setPage(1);
                }}
                className="text-[10px] text-red-500 hover:underline font-bold"
              >
                Clear All
              </button>
            </div>
          )}

          {/* DOUBT FEED */}
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
              <div className="text-6xl mb-6">💡</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                No doubts found
              </h2>
              <p className="text-gray-500 mb-8 font-medium">
                Try a different search or be the first to post!
              </p>
              <Link
                to="/doubts/new"
                className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 inline-block"
              >
                Post a Doubt
              </Link>
            </div>
          ) : (
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

              <Pagination
                currentPage={page}
                totalPages={pages}
                onPageChange={handlePageChange}
              />
            </motion.div>
          )}
        </div>

        {/* SIDEBAR (Right) */}
        <div className="lg:col-span-4 space-y-8">
          <TrendingSection />
        </div>
      </div>
    </div>
  );
}

function TrendingSection() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await doubtAPI.getTrending();
        setTrending(res.data.data);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-xl">🔥</span>
        <h2 className="font-bold text-gray-900 tracking-tight">
          Most Asked Doubts
        </h2>
      </div>

      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))
        ) : trending.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">
            No trending topics yet
          </p>
        ) : (
          trending.map((d) => (
            <Link
              key={d._id}
              to={`/doubts/${d._id}`}
              className="group block p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 transition-all"
            >
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                {d.title}
              </h3>
              <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded-lg group-hover:bg-white transition-colors">
                  {d.subject}
                </span>
                <span className="flex items-center gap-1">
                  👍 {d.upvoteCount}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
function StatCard({ label, value, icon, color }) {
  const colorMap = {
    indigo: "from-indigo-50 to-white text-indigo-600 border-indigo-100",
    emerald: "from-emerald-50 to-white text-emerald-600 border-emerald-100",
    orange: "from-orange-50 to-white text-orange-600 border-orange-100",
    purple: "from-purple-50 to-white text-purple-600 border-purple-100",
  };

  return (
    <div
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
