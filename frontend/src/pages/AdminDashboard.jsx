import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { adminAPI, doubtAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPages, setUserPages] = useState(1);
  const [doubtPage, setDoubtPage] = useState(1);
  const [doubtPages, setDoubtPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const { user } = useAuth();
  const feedRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userParams = { page: userPage, limit: 5 };
      if (roleFilter !== "all") {
        userParams.role = roleFilter;
      }

      const doubtParams = { page: doubtPage, limit: 5 };

      const [pendingRes, statsRes, usersRes, doubtsRes] = await Promise.all([
        adminAPI.getPending(),
        adminAPI.getStats(),
        adminAPI.getAllUsers(userParams),
        doubtAPI.getAll(doubtParams),
      ]);

      setPending(pendingRes.data);
      setStats(statsRes.data);

      const usersData = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data.users || [];
      setUsers(usersData);
      setUserPages(usersRes.data.pages || 1);

      setDoubts(doubtsRes.data.data || []);
      setDoubtPages(doubtsRes.data.pages || 1);
    } catch (err) {
      setError("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await adminAPI.approve(id);
    fetchData();
  };

  const handleReject = async (id) => {
    if (
      window.confirm("Are you sure you want to reject and delete this faculty?")
    ) {
      await adminAPI.reject(id);
      fetchData();
    }
  };

  const handleDeleteUser = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.",
      )
    ) {
      try {
        await adminAPI.deleteUser(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteDoubt = async (id) => {
    if (
      window.confirm("Are you sure you want to PERMANENTLY delete this doubt?")
    ) {
      try {
        await doubtAPI.delete(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
    if (userPage > 1 || doubtPage > 1) {
      feedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [userPage, doubtPage, roleFilter]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">
        Loading admin dashboard...
      </div>
    );

  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  if (!user) return null;

  return (
    <div className="space-y-10">
      {/* HERO SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 text-white p-10 md:p-14 shadow-2xl"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl opacity-50" />

        <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              Welcome back, {user.name} <br />
              <span className="text-indigo-200 text-2xl md:text-3xl font-bold opacity-80">
                Admin Console
              </span>
            </h1>

            <p className="text-lg text-indigo-100/90 font-medium max-w-lg">
              Manage users, monitor activity, and oversee faculty approvals
              globally.
            </p>
          </div>

          <div className="hidden lg:block">
            <div className="w-48 h-48 bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 flex items-center justify-center text-7xl shadow-inner animate-fade-in">
              ⚙️
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS OVERVIEW */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {stats && (
          <>
            <StatCard
              label="Students"
              value={stats.totalStudents}
              icon="👥"
              color="indigo"
            />
            <StatCard
              label="Faculty"
              value={stats.totalFaculty}
              icon="👨‍🏫"
              color="purple"
            />
            <StatCard
              label="Resolved"
              value={stats.resolvedDoubts}
              icon="✅"
              color="emerald"
            />
            <StatCard
              label="Pending Doubts"
              value={stats.pendingDoubts}
              icon="⏳"
              color="amber"
            />
            <StatCard
              label="Total Doubts"
              value={stats.totalDoubts}
              icon="📚"
              color="indigo"
            />
            <StatCard
              label="Pending Approvals"
              value={stats.pendingFaculty}
              icon="🛡️"
              color="amber"
            />
          </>
        )}
      </motion.div>

      {/* TABS NAVIGATION */}
      <div className="flex glass p-1.5 rounded-2xl border-white/40 max-w-fit mx-auto md:mx-0">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
            activeTab === "users"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveTab("doubts")}
          className={`px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
            activeTab === "doubts"
              ? "bg-indigo-600 text-white shadow-lg"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Doubt Management
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "users" ? (
          <motion.div
            key="users-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            ref={feedRef}
            className="glass rounded-[2rem] shadow-premium p-8 md:p-12 border-white/40"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
                User Directory
              </h2>
              <div className="flex glass p-1 rounded-2xl border-white/40">
                {["all", "student", "faculty"].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setRoleFilter(role);
                      setUserPage(1);
                    }}
                    className={`px-6 py-2 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${
                      roleFilter === role
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {role}s
                  </button>
                ))}
              </div>
            </div>

            {!users || users.length === 0 ? (
              <p className="text-center py-10 text-gray-500 italic">
                No users found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        User
                      </th>
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Role
                      </th>
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Dept
                      </th>
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr
                        key={u._id}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-2">
                          <div className="font-semibold text-gray-900 leading-none mb-1">
                            {u.name}
                          </div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-md ${
                              u.role === "faculty"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-sm text-gray-600 font-medium">
                          {u.department}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete User"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {userPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-100">
                <button
                  disabled={userPage === 1}
                  onClick={() => setUserPage((prev) => prev - 1)}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Prev
                </button>
                <span className="text-xs text-gray-500 font-medium tracking-tight">
                  Page{" "}
                  <span className="font-bold text-gray-900">{userPage}</span> of{" "}
                  {userPages}
                </span>
                <button
                  disabled={userPage === userPages}
                  onClick={() => setUserPage((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="doubts-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            ref={feedRef}
            className="glass rounded-[2rem] shadow-premium p-8 md:p-12 border-white/40"
          >
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight">
                Global Doubts
              </h2>
            </div>

            {!doubts || doubts.length === 0 ? (
              <p className="text-center py-10 text-gray-500 italic">
                No doubts found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Title
                      </th>
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Subject
                      </th>
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                        Status
                      </th>
                      <th className="py-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400 text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {doubts.map((d) => (
                      <tr
                        key={d._id}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-2 max-w-xs">
                          <div className="font-semibold text-gray-900 truncate">
                            {d.title}
                          </div>
                          <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                            <span>Posted by</span>
                            <span className="font-medium text-indigo-500">
                              {d.postedBy?.name || "Unknown"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-sm text-gray-600 font-medium">
                          {d.subject}
                        </td>
                        <td className="py-4 px-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-md ${
                              d.status === "answered"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => handleDeleteDoubt(d._id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Doubt"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {doubtPages > 1 && (
              <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-gray-100">
                <button
                  disabled={doubtPage === 1}
                  onClick={() => setDoubtPage((prev) => prev - 1)}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Prev
                </button>
                <span className="text-xs text-gray-500 font-medium tracking-tight">
                  Page{" "}
                  <span className="font-bold text-gray-900">{doubtPage}</span>{" "}
                  of {doubtPages}
                </span>
                <button
                  disabled={doubtPage === doubtPages}
                  onClick={() => setDoubtPage((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl border border-gray-200 text-xs font-semibold disabled:opacity-40 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PENDING SECTION */}

      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Pending Faculty Approvals
        </h2>

        {pending.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-gray-600">No pending approvals</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pending.map((faculty) => (
              <div
                key={faculty._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">{faculty.name}</p>
                  <p className="text-sm text-gray-500">{faculty.email}</p>
                  <p className="text-xs text-gray-400">
                    {faculty.department} · {faculty.facultyId}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleApprove(faculty._id)}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(faculty._id)}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* STAT CARD */
function StatCard({ label, value, icon, color }) {
  const colorMap = {
    indigo: "from-indigo-50 to-white text-indigo-700 border-indigo-100",
    purple: "from-purple-50 to-white text-purple-700 border-purple-100",
    amber: "from-amber-50 to-white text-amber-700 border-amber-100",
    emerald: "from-emerald-50 to-white text-emerald-700 border-emerald-100",
    rose: "from-rose-50 to-white text-rose-700 border-rose-100",
    sage: "from-sage-50 to-white text-sage-700 border-sage-100",
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
      }}
      className={`p-6 rounded-3xl bg-gradient-to-br border ${colorMap[color]} shadow-soft hover:shadow-lg transition-all duration-300 group`}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl group-hover:scale-110 transition-transform">
          {icon}
        </span>
        <div className="text-left">
          <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
            {label}
          </p>
          <h2 className="text-2xl font-black">{value}</h2>
        </div>
      </div>
    </motion.div>
  );
}
