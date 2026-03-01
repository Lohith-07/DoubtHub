import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doubtAPI, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const SUBJECTS_MAP = {
  CSE: [
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "Computer Networks",
    "DBMS",
    "Software Engineering",
    "Theory of Computation",
    "Compiler Design",
    "Artificial Intelligence",
    "Cybersecurity",
  ],
  CSD: [
    "Data Structures",
    "Operating Systems",
    "UI/UX Design",
    "Web Development",
    "Computer Graphics",
    "Human-Computer Interaction",
    "Discrete Mathematics",
    "Software Engineering",
    "Multimedia Systems",
    "Design Thinking",
  ],
  CSM: [
    "Data Structures",
    "Algorithms",
    "DBMS",
    "Machine Learning",
    "Artificial Intelligence",
    "Probability & Statistics",
    "Python for Data Science",
    "Deep Learning",
    "Data Mining",
    "Big Data Analytics",
  ],
  IT: [
    "Web Technologies",
    "Information Security",
    "Cloud Computing",
    "Mobile Application Development",
    "System Administration",
    "Network Security",
    "E-Commerce",
    "Distributed Systems",
    "Software Project Management",
    "IT Infrastructure",
  ],
  ECE: [
    "Electronic Devices",
    "Digital Signal Processing",
    "Analog Communications",
    "Microprocessors",
    "VLSI Design",
    "Control Systems",
    "Electromagnetic Theory",
    "Embedded Systems",
    "Communications Networks",
    "Signals and Systems",
  ],
  EEE: [
    "Power Systems",
    "Electrical Machines",
    "Power Electronics",
    "Circuit Theory",
    "Renewable Energy Systems",
    "Instrumentation",
    "Electrical Measurements",
    "High Voltage Engineering",
    "Integrated Circuits",
    "Electric Drives",
  ],
  CIVIL: [
    "Structural Analysis",
    "Strength of Materials",
    "Fluid Mechanics",
    "Surveying",
    "Geotechnical Engineering",
    "Transportation Engineering",
    "Environmental Engineering",
    "Concrete Technology",
    "Hydraulics",
    "Construction Management",
  ],
  MECH: [
    "Thermodynamics",
    "Heat Transfer",
    "Fluid Mechanics",
    "Kinematics of Machines",
    "Manufacturing Processes",
    "Engineering Mechanics",
    "Automobile Engineering",
    "CAD/CAM",
    "Robotics",
    "Material Science",
  ],
};

export default function CreateDoubt() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    assignedTo: "",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const [facultyList, setFacultyList] = useState([]);
  const [loadingFaculty, setLoadingFaculty] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userSubjects = SUBJECTS_MAP[user?.department] || [];

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!form.subject) {
      setFacultyList([]);
      return;
    }

    const fetchFaculty = async () => {
      try {
        setLoadingFaculty(true);
        const res = await userAPI.getFacultyBySubject(form.subject);
        setFacultyList(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFaculty(false);
      }
    };

    fetchFaculty();
  }, [form.subject]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.subject) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      const tagsArray = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");

      if (!user)
        throw new Error("User authentication lost. Please log in again.");

      await doubtAPI.create({
        title: form.title.trim(),
        description: form.description.trim(),
        subject: form.subject,
        department: user.department || "General",
        assignedTo: form.assignedTo || null,
        tags: tagsArray,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 shadow-lg"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-40"
        />

        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight">
            Post a New Doubt
          </h1>
          <p className="mt-2 text-indigo-100">
            Provide clear details so faculty can assist effectively.
          </p>
        </div>
      </motion.div>

      {/* FORM CARD */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="bg-white/90 backdrop-blur-xl border border-gray-200/60 rounded-3xl shadow-lg p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          {/* Subject Section */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <select
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            >
              <option value="">Select a subject</option>
              {userSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Faculty Assignment */}
          {form.subject && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 overflow-hidden"
            >
              <label className="text-sm font-medium text-gray-700">
                Assign to Faculty (Optional)
              </label>

              {loadingFaculty ? (
                <p className="text-sm text-gray-500">Loading faculty...</p>
              ) : facultyList.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No faculty available for this subject
                </p>
              ) : (
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
                >
                  <option value="">Select Faculty</option>
                  {facultyList.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name} ({faculty.department})
                    </option>
                  ))}
                </select>
              )}
            </motion.div>
          )}

          {/* Title */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Doubt Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. What is the difference between TCP and UDP?"
              maxLength={150}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <div className="text-xs text-gray-400 text-right">
              {form.title.length}/150
            </div>
          </motion.div>

          {/* Tags */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. recursion, javascript, logic (separate by commas)"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <p className="text-[10px] text-gray-400">
              Help students and faculty find your doubt more easily.
            </p>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Detailed Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Describe your doubt clearly. Mention what you've tried and where you're stuck."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 resize-none transition-all"
            />
          </motion.div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
            <p className="font-semibold mb-2">Tips for better answers:</p>
            <ul className="space-y-1 list-disc list-inside text-amber-700">
              <li>Be specific about your confusion</li>
              <li>Mention relevant topics or chapters</li>
              <li>Include what you’ve already tried</li>
            </ul>
          </div>

          {/* Buttons */}
          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 0.98, backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/dashboard")}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-sm transition-all"
            >
              Cancel
            </motion.button>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post Doubt"}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
