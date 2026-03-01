import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doubtAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function ViewDoubt() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doubt, setDoubt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [answer, setAnswer] = useState("");
  const [ansError, setAnsError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    subject: "",
  });

  const { socket } = useAuth();

  useEffect(() => {
    fetchDoubt();
  }, [id]);

  useEffect(() => {
    if (socket) {
      socket.emit("join", id); // Join thread room
      socket.on("newReply", (data) => {
        if (data.doubtId === id) {
          setDoubt((prev) => ({
            ...prev,
            replies: [...prev.replies, data.reply],
          }));
        }
      });
      return () => socket.off("newReply");
    }
  }, [socket, id]);

  const fetchDoubt = () => {
    doubtAPI
      .getSingle(id)
      .then((res) => {
        setDoubt(res.data.data);
        setEditData({
          title: res.data.data.title,
          description: res.data.data.description,
          subject: res.data.data.subject,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleUpdateDoubt = async (e) => {
    e.preventDefault();
    try {
      const res = await doubtAPI.update(id, editData);
      setDoubt(res.data.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteDoubt = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this doubt? This action cannot be undone.",
      )
    )
      return;
    try {
      await doubtAPI.delete(id);
      navigate(backPath);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setAnsError("Answer cannot be empty");
      return;
    }

    try {
      setSubmitting(true);
      const res = await doubtAPI.answer(id, { answer });
      setDoubt(res.data.data);
      setAnswer("");
    } catch (err) {
      setAnsError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      const res = await doubtAPI.addReply(id, {
        message: replyMessage,
        parentReply: replyingTo,
      });
      // Doubt state will be updated by socket or manually
      setReplyMessage("");
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Delete this reply?")) return;
    try {
      await doubtAPI.deleteReply(id, replyId);
      setDoubt((prev) => ({
        ...prev,
        replies: prev.replies.filter(
          (r) => r._id !== replyId && r.parentReply !== replyId,
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTagClick = (tag) => {
    const target = user.role === "faculty" ? "/faculty" : "/dashboard";
    navigate(`${target}?tag=${encodeURIComponent(tag)}`);
  };

  const backPath = user.role === "faculty" ? "/faculty" : "/dashboard";

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading doubt...</div>
    );

  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  if (!doubt) return null;

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(backPath)}
        className="text-sm text-gray-500 hover:text-gray-800 transition-all flex items-center gap-1 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform">
          ←
        </span>{" "}
        Back to Dashboard
      </motion.button>

      {/* QUESTION CARD */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass rounded-[2.5rem] shadow-premium p-8 md:p-12 space-y-8 border-white/40"
      >
        {/* Subject + Status */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <motion.span
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100"
          >
            {doubt.subject}
          </motion.span>

          {doubt.status === "answered" ? (
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium border border-emerald-200">
              ✓ Resolved
            </span>
          ) : (
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium border border-amber-200"
            >
              ● Pending
            </motion.span>
          )}

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 shadow-inner">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              Upvotes
            </span>
            <span className="text-sm font-bold text-gray-900">
              {doubt.upvoteCount}
            </span>
          </div>
        </div>

        {/* Tags */}
        {doubt.tags && doubt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {doubt.tags.map((tag, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05, backgroundColor: "#eef2ff" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagClick(tag)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-500 font-medium border border-indigo-100/50 transition-all cursor-pointer"
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        )}

        {/* Title */}
        {isEditing ? (
          <form onSubmit={handleUpdateDoubt} className="space-y-4 pt-4">
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full text-2xl font-bold bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              value={editData.subject}
              onChange={(e) =>
                setEditData({ ...editData, subject: e.target.value })
              }
              className="w-full text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full h-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-xl text-sm font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <h1 className="text-2xl font-bold text-gray-900 leading-snug tracking-tight">
            {doubt.title}
          </h1>
        )}

        {/* Action Buttons (Edit/Delete) */}
        {!isEditing &&
          (user._id === doubt.postedBy?._id || user.role === "admin") && (
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              {user._id === doubt.postedBy?._id && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all"
                >
                  ✏️ Edit Doubt
                </button>
              )}
              <button
                onClick={handleDeleteDoubt}
                className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all"
              >
                🗑️ Delete Doubt
              </button>
            </div>
          )}

        {/* Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50 pb-4">
          <div className="text-xs text-gray-500 flex items-center gap-1.5 flex-wrap">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
              {doubt.postedBy?.name?.charAt(0)}
            </div>
            <span className="font-semibold text-gray-900">
              {doubt.postedBy?.name}
            </span>
            <span className="opacity-30">•</span>
            <span>{doubt.postedBy?.department}</span>
            <span className="opacity-30">•</span>
            <span className="text-gray-400">{formatDate(doubt.createdAt)}</span>
          </div>

          {doubt.assignedTo && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50/50 rounded-xl border border-indigo-100/30">
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-tight">
                Assigned To
              </span>
              <span className="text-xs font-medium text-indigo-700">
                {doubt.assignedTo.name}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed border-t border-gray-100 pt-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {doubt.description}
          </ReactMarkdown>
        </div>
      </motion.div>

      <AnimatePresence>
        {doubt.status === "answered" && doubt.answer && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border-emerald-500/20 rounded-[2.5rem] shadow-premium p-8 md:p-12 space-y-8 relative overflow-hidden group mb-10"
          >
            {/* Soft Emerald Glow Background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] -mr-40 -mt-40 group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-[80px] -ml-32 -mb-32" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl text-lg shadow-inner">
                  ✨
                </span>
                <div>
                  <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em] leading-none mb-1">
                    Faculty Resolution
                  </h2>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Verified Solution
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-100">
                ✓ Solved
              </span>
            </div>

            <div className="relative z-10 prose prose-indigo max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {doubt.answer}
              </ReactMarkdown>
            </div>

            {doubt.answeredBy && (
              <div className="relative z-10 text-xs text-gray-500 border-t border-gray-100 pt-6 flex flex-wrap gap-x-6 gap-y-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-50 to-indigo-50 flex items-center justify-center text-xs font-bold text-emerald-700 shadow-sm border border-emerald-100/50">
                    {doubt.answeredBy?.name?.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 leading-none mb-0.5">
                      {doubt.answeredBy.name}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {doubt.answeredBy.department}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto sm:ml-0">
                  <span className="text-gray-300">
                    ID:{" "}
                    <span className="text-gray-600 font-mono">
                      {doubt.answeredBy.facultyId}
                    </span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {doubt.status !== "answered" && (
        <>
          {/* FACULTY ANSWER FORM */}
          {user.role === "faculty" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-lg p-8 space-y-6"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Write Your Answer
              </h2>

              {ansError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
                >
                  {ansError}
                </motion.div>
              )}

              <form onSubmit={handleAnswer} className="space-y-6">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={6}
                  placeholder="Write a clear and detailed answer..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 shadow-soft transition-all"
                />

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 0.98, backgroundColor: "#f9fafb" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(backPath)}
                    className="flex-1 py-3 rounded-xl border border-gray-300 text-sm transition-all"
                  >
                    Cancel
                  </motion.button>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={submitting}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Answer"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STUDENT WAITING STATE */}
          {user.role === "student" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-soft p-10 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                ⏳
              </motion.div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Awaiting Faculty Response
              </h2>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Your doubt is in the queue. A specialized faculty member will
                provide a detailed resolution soon.
              </p>
            </motion.div>
          )}
        </>
      )}
      <div className="border-t border-gray-100 pt-10 space-y-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>💬</span> Discussion ({doubt.replies?.length || 0})
        </h2>

        {/* Reply Form */}
        <form onSubmit={handleReply} className="relative">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder={
              replyingTo ? "Replying to user..." : "Add to the discussion..."
            }
            rows={2}
            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-24 resize-none shadow-sm"
          />
          <div className="absolute right-4 bottom-4 flex items-center gap-2">
            {replyingTo && (
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!replyMessage.trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
            >
              Post
            </button>
          </div>
        </form>

        {/* Replies List */}
        <div className="space-y-6">
          {doubt.replies
            ?.filter((r) => !r.parentReply)
            .map((reply) => (
              <div key={reply._id} className="space-y-4">
                <ReplyCard
                  reply={reply}
                  user={user}
                  onReply={() => setReplyingTo(reply._id)}
                  onDelete={() => handleDeleteReply(reply._id)}
                />

                {/* Nested Replies */}
                <div className="ml-12 space-y-4 border-l-2 border-gray-50 pl-6">
                  {doubt.replies
                    ?.filter((r) => r.parentReply === reply._id)
                    .map((subReply) => (
                      <ReplyCard
                        key={subReply._id}
                        reply={subReply}
                        user={user}
                        onDelete={() => handleDeleteReply(subReply._id)}
                        isNested
                      />
                    ))}
                </div>
              </div>
            ))}

          {(!doubt.replies || doubt.replies.length === 0) && (
            <div className="text-center py-10 text-gray-400 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
              No replies yet. Start the conversation!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplyCard({ reply, user, onReply, onDelete, isNested }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-5 rounded-2xl border border-gray-100 bg-white shadow-soft ${isNested ? "bg-gray-50/30" : ""}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
            {reply.postedBy?.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                {reply.postedBy?.name}
              </span>
              <span
                className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-md font-bold ${
                  reply.role === "faculty"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {reply.role}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              {new Date(reply.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNested && onReply && (
            <button
              onClick={onReply}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all"
            >
              Reply
            </button>
          )}
          {(reply.postedBy?._id === user._id || user.role === "admin") && (
            <button
              onClick={onDelete}
              className="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <div className="prose prose-sm prose-indigo max-w-none text-gray-700 leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {reply.message}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}
