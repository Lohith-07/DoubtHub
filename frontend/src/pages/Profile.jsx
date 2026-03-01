import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { doubtAPI, adminAPI } from "../services/api";

import DoubtCard from "../components/DoubtCard";

export default function Profile() {
  const { user } = useAuth();
  const [myDoubts, setMyDoubts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      console.log("Fetching profile data for role:", user.role);
      try {
        setLoading(true);
        if (user.role === "student") {
          const res = await doubtAPI.getAll({ my: "true" });
          setMyDoubts(res.data.data || []);
        } else if (user.role === "faculty") {
          const res = await doubtAPI.getAll({
            assignedTo: user._id,
            limit: 1000,
          });
          const assigned = res.data.data || [];
          setStats({
            total: res.data.total,
            pending: assigned.filter((d) => d.status === "pending").length,
            resolved: assigned.filter((d) => d.status === "answered").length,
          });
        } else if (user.role === "admin") {
          const res = await adminAPI.getStats();
          setStats(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-pulse">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium tracking-wide">
          Gathering profile data...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* PROFILE HERO - Premium Glass */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white p-10 md:p-16 shadow-premium group">
        <div className="absolute inset-0 bg-mesh opacity-20" />
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-500/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 text-indigo-700 flex items-center justify-center text-4xl font-black shadow-inner border-4 border-white/20">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">
                {user.name}
              </h1>
              <p className="text-indigo-100/90 mt-1.5 text-lg font-medium">
                {user.email}
              </p>
              <span className="inline-block mt-4 text-[11px] uppercase tracking-widest font-black px-4 py-1.5 rounded-xl bg-white/10 border border-white/5">
                {user.role}
              </span>
            </div>
          </div>

          {user.department && (
            <div className="text-right hidden md:block">
              <p className="text-indigo-200 text-sm font-bold uppercase tracking-wider mb-1">
                Department
              </p>
              <p className="text-2xl font-bold">{user.department}</p>
              {user.semester && (
                <p className="text-indigo-100 opacity-80 mt-1 font-medium">
                  Semester {user.semester}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DETAILS + STATS */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* DETAILS CARD */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] shadow-premium p-10 md:p-14 space-y-10 border-white/40">
          <h2 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-4">
            <span className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-500 rounded-xl text-lg shadow-inner">
              👤
            </span>
            Account Profile
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {user.department && (
              <DetailItem label="Department" value={user.department} />
            )}

            {user.semester && (
              <DetailItem label="Semester" value={user.semester} />
            )}

            {user.createdAt && (
              <DetailItem
                label="Member Since"
                value={new Date(user.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              />
            )}

            <DetailItem label="System ID" value={user._id} />
          </div>
        </div>

        {/* STATS CARD */}
        <div className="glass rounded-[2.5rem] shadow-premium p-10 border-white/40">
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-10 flex items-center gap-4">
            <span className="w-10 h-10 flex items-center justify-center bg-purple-50 text-purple-500 rounded-xl text-lg shadow-inner">
              📊
            </span>
            Account Activity
          </h2>

          <div className="space-y-6">
            {user.role === "student" && (
              <>
                <StatItem label="Total Questions" value={myDoubts.length} />
                <StatItem
                  label="Resolved"
                  value={myDoubts.filter((d) => d.status === "answered").length}
                  color="emerald"
                />
                <StatItem
                  label="Pending"
                  value={myDoubts.filter((d) => d.status === "pending").length}
                  color="amber"
                />
                <StatItem
                  label="Most Upvoted"
                  value={Math.max(
                    ...myDoubts.map((d) => d.upvoteCount || 0),
                    0,
                  )}
                  color="orange"
                />
              </>
            )}

            {user.role === "faculty" && stats && (
              <>
                <StatItem label="Assigned" value={stats.total} />
                <StatItem
                  label="Resolved"
                  value={stats.resolved}
                  color="emerald"
                />
                <StatItem label="Pending" value={stats.pending} color="amber" />
              </>
            )}

            {user.role === "admin" && stats && (
              <>
                <StatItem
                  label="Students"
                  value={stats.totalStudents}
                  color="indigo"
                />
                <StatItem
                  label="Faculty"
                  value={stats.totalFaculty}
                  color="purple"
                />
                <StatItem
                  label="Resolved"
                  value={stats.resolvedDoubts}
                  color="emerald"
                />
                <StatItem
                  label="Pending Doubts"
                  value={stats.pendingDoubts}
                  color="amber"
                />
                <StatItem
                  label="Announcements"
                  value={stats.quaternary.value}
                  color="rose"
                />
                <StatItem
                  label="Total Doubts"
                  value={stats.totalDoubts}
                  color="indigo"
                />
              </>
            )}

            {loading && (
              <p className="text-gray-500 animate-pulse">Loading stats...</p>
            )}
          </div>
        </div>
      </div>

      {/* MY DOUBTS */}
      {user.role === "student" && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">My Doubts</h3>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : myDoubts.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-12 text-center">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-600">
                You haven't posted any doubts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {myDoubts.map((doubt) => (
                <DoubtCard key={doubt._id} doubt={doubt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* Reusable Detail */
function DetailItem({ label, value }) {
  return (
    <div className="group">
      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1.5 transition-colors group-hover:text-indigo-600">
        {label}
      </p>
      <p className="font-bold text-gray-800 text-lg break-all">{value}</p>
    </div>
  );
}

/* Reusable Stat */
function StatItem({ label, value, color }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    default: "bg-gray-50 text-gray-700 border-gray-100",
  };

  const currentColor = colorMap[color] || colorMap.default;

  return (
    <div className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl hover:border-indigo-200 transition-all duration-300 group">
      <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
      <span
        className={`text-xl font-black px-4 py-1 rounded-xl border ${currentColor} shadow-sm`}
      >
        {value}
      </span>
    </div>
  );
}
