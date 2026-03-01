import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { doubtAPI } from "../services/api";
import { useState, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
  hover: {
    y: -6,
    scale: 1.01,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DoubtCard = forwardRef(({ doubt }, ref) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [upvotes, setUpvotes] = useState(doubt.upvoteCount || 0);
  const [liked, setLiked] = useState(false);

  // Assignment Logic
  let assignmentLabel = null;
  let assignmentStyle = "";

  if (doubt.assignedTo) {
    const isAssignedToMe =
      user?._id === (doubt.assignedTo._id || doubt.assignedTo);
    if (isAssignedToMe) {
      assignmentLabel = "Assigned to You";
      assignmentStyle =
        "bg-purple-100 text-purple-700 border border-purple-200";
    } else {
      assignmentLabel = `Assigned to ${doubt.assignedTo.name || "Faculty"}`;
      assignmentStyle = "bg-indigo-50 text-indigo-600 border border-indigo-100";
    }
  } else if (user?.role === "faculty") {
    assignmentLabel = "Unassigned";
    assignmentStyle = "bg-amber-50 text-amber-600 border border-amber-100";
  }

  useEffect(() => {
    setUpvotes(doubt.upvoteCount || 0);

    if (doubt.upvotes && user?._id) {
      const hasLiked = doubt.upvotes.some(
        (id) => id.toString() === user._id.toString(),
      );
      setLiked(hasLiked);
    }
  }, [doubt, user]);

  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    const target = user.role === "faculty" ? "/faculty" : "/dashboard";
    // We use the 'tag' query parameter for exact match
    navigate(`${target}?tag=${encodeURIComponent(tag)}`);
  };

  const detailPath =
    user.role === "faculty"
      ? `/faculty/doubts/${doubt._id}`
      : `/doubts/${doubt._id}`;

  const handleUpvote = async (e) => {
    e.stopPropagation();
    if (user.role !== "student") return;

    try {
      const res = await doubtAPI.toggleUpvote(doubt._id);
      setUpvotes(res.data.upvotesCount);
      setLiked((prev) => !prev);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this doubt?")) return;
    try {
      await doubtAPI.delete(doubt._id);
      window.location.reload(); // Simple refresh to update the list
    } catch (err) {
      console.error(err);
    }
  };

  const statusColor =
    doubt.status === "answered" ? "bg-emerald-500" : "bg-amber-500";

  const subjectColors = {
    CSE: "bg-indigo-50 text-indigo-700 border-indigo-100",
    CSD: "bg-purple-50 text-purple-700 border-purple-100",
    CSM: "bg-blue-50 text-blue-700 border-blue-100",
    IT: "bg-cyan-50 text-cyan-700 border-cyan-100",
    ECE: "bg-amber-50 text-amber-700 border-amber-100",
    EEE: "bg-orange-50 text-orange-700 border-orange-100",
    CIVIL: "bg-emerald-50 text-emerald-700 border-emerald-100",
    MECH: "bg-rose-50 text-rose-700 border-rose-100",
  };

  const currentSubjectColor =
    subjectColors[doubt.subject] || "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={() => navigate(detailPath)}
      className="group relative flex glass rounded-3xl cursor-pointer overflow-hidden transition-all duration-500 shadow-hover"
    >
      {/* LEFT STATUS ACCENT */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 ${statusColor} opacity-80`}
      />

      {/* Vote Column */}
      <div className="w-20 flex flex-col items-center justify-center py-6 border-r border-white/40 bg-white/20 backdrop-blur-sm">
        {user.role === "student" && (
          <>
            <motion.button
              whileHover={{ scale: 1.2, color: "#4f46e5" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleUpvote}
              className={`text-xl transition-all duration-300 ${
                liked
                  ? "text-indigo-600 scale-125 drop-shadow-sm"
                  : "text-gray-300"
              }`}
            >
              ▲
            </motion.button>

            <span
              className={`mt-1 text-sm font-bold ${
                liked ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              {upvotes}
            </span>
          </>
        )}

        {user.role === "faculty" && (
          <span className="text-sm font-bold text-gray-600">{upvotes}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Top Meta */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <span
            className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg font-bold border ${currentSubjectColor}`}
          >
            {doubt.subject}
          </span>

          <span className="text-[10px] font-medium text-gray-400">
            {formatDate(doubt.createdAt)}
          </span>
          {(user?._id === (doubt.postedBy?._id || doubt.postedBy) ||
            user?.role === "admin") && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
              title="Delete Doubt"
            >
              🗑️
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-1">
          {doubt.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {doubt.description}
        </p>

        {/* Tags */}
        {doubt.tags && doubt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {doubt.tags.map((tag, idx) => (
              <motion.span
                key={idx}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#eef2ff",
                  color: "#4f46e5",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleTagClick(e, tag)}
                className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-50 text-gray-400 transition-all cursor-pointer font-medium border border-transparent hover:border-indigo-100"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Bottom Row */}
        <div className="flex items-center gap-3 mt-6 text-[11px] font-medium flex-wrap">
          {/* Status Badge */}
          {doubt.status === "answered" ? (
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              ✓ Solved
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 animate-pulse-soft">
              ● Pending
            </span>
          )}

          {/* Assignment Badge */}
          {assignmentLabel && (
            <span
              className={`px-3 py-1 rounded-full border ${assignmentStyle}`}
            >
              {assignmentLabel}
            </span>
          )}

          {/* Faculty: Author Info */}
          {user.role === "faculty" && doubt.postedBy?.name && (
            <span className="text-gray-400 ml-auto">
              by <span className="text-gray-900">{doubt.postedBy.name}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default DoubtCard;
