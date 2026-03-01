import { useState } from "react";
import { notesAPI } from "../services/api";
import { motion } from "framer-motion";

export default function CreateNotes({ onClose, onUpload }) {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    semester: "",
    department: "",
  });
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      setError("Please select at least one file");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("subject", formData.subject);
    data.append("semester", formData.semester);
    data.append("department", formData.department);
    for (let i = 0; i < files.length; i++) {
      data.append("files", files[i]);
    }

    try {
      setLoading(true);
      await notesAPI.upload(data);
      onUpload();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 30 }}
        className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] p-10 md:p-12 overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />

        <button
          onClick={onClose}
          className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 z-10"
        >
          ✕
        </button>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Share Your <span className="text-indigo-600">Notes</span>
          </h2>
          <p className="text-gray-500 mt-2 mb-8 font-medium">
            Upload study materials to help your fellow students.
          </p>

          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-red-50 text-red-600 p-4 rounded-[1.5rem] text-sm mb-8 border border-red-100 flex items-center gap-3"
            >
              <span className="text-lg">⚠️</span>
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
                Document Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-300"
                placeholder="e.g., Computer Networks - Unit 1 Overview"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 outline-none text-gray-900 font-medium placeholder:text-gray-300"
                  placeholder="CS101, Math, etc."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
                  Semester
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({ ...formData, semester: e.target.value })
                    }
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 outline-none text-gray-900 font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] ml-2">
                Files
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  required
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50/30 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all duration-300 cursor-pointer group/upload"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl group-hover/upload:scale-110 transition-transform duration-300">
                    📤
                  </div>
                  <p className="mt-4 text-sm font-bold text-gray-600">
                    {files && files.length > 0
                      ? `${files.length} files selected`
                      : "Drop your files here or click to browse"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                    PDF, DOC, PPT up to 10MB
                  </p>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold shadow-xl shadow-indigo-100 mt-4 disabled:opacity-50 transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading to Cloud...</span>
                </div>
              ) : (
                "Publish Materials"
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
