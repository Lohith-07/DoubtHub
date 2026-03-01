import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const shakeVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4,
      x: { duration: 0.4 },
      opacity: { duration: 0.2 },
      y: { duration: 0.2 },
    },
  },
};

const DEPARTMENTS = ["CSE", "CSD", "CSM", "IT", "ECE", "EEE", "CIVIL", "MECH"];

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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    facultyId: "",
    department: "",
    semester: "",
    courses: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (subject) => {
    setForm((prev) => {
      const alreadySelected = prev.courses.includes(subject);

      return {
        ...prev,
        courses: alreadySelected
          ? prev.courses.filter((c) => c !== subject)
          : [...prev.courses, subject],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password || !form.department) {
      setError("Name, email, password, and department are required.");
      return;
    }

    if (form.role === "student" && !form.semester) {
      setError("Semester is required for students.");
      return;
    }

    if (form.role === "faculty" && !form.facultyId) {
      setError("Faculty ID is required.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department || undefined,

      ...(form.role === "faculty" && {
        facultyId: form.facultyId,
        courses: form.courses,
      }),

      ...(form.role === "student" &&
        form.semester && {
          semester: parseInt(form.semester),
        }),
    };

    try {
      setLoading(true);

      await authAPI.register(payload);

      alert(
        form.role === "faculty"
          ? "Registration successful. Await admin approval before logging in."
          : "Registration successful. Please login.",
      );

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-300/20 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl grid md:grid-cols-2 glass rounded-[2.5rem] shadow-premium overflow-hidden relative z-10"
      >
        {/* LEFT PANEL */}
        <motion.div
          variants={itemVariants}
          className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute -top-10 -right-10 w-72 h-72 bg-white/20 rounded-full blur-3xl"
          />

          <div className="relative space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Join DoubtHub</h1>
            <p className="text-indigo-100">
              Connect students and faculty through structured academic
              discussions.
            </p>
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl drop-shadow-2xl"
            >
              🎓
            </motion.div>
          </div>
        </motion.div>

        {/* FORM PANEL */}
        <div className="p-8 md:p-14 bg-white/40 backdrop-blur-sm max-h-[90vh] overflow-y-auto custom-scrollbar">
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center md:text-left"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Join the DoubtHub community today
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  variants={shakeVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Role Toggle */}
            <motion.div variants={itemVariants} className="flex gap-3">
              {["student", "faculty"].map((role) => (
                <motion.button
                  key={role}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, role }))}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    form.role === role
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white/50 border border-white/60 text-gray-600 hover:bg-white hover:border-indigo-200"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </motion.button>
              ))}
            </motion.div>

            {/* Name */}
            <motion.div variants={itemVariants}>
              <InputField
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <InputField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <InputField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </motion.div>

            {/* Department */}
            <motion.div variants={itemVariants}>
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
                Academic Department
              </label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-white/60 border border-white/40 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all duration-300 shadow-sm"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </motion.div>

            <AnimatePresence mode="popLayout" initial={false}>
              {/* Faculty Subjects */}
              {form.role === "faculty" && form.department && (
                <motion.div
                  key="faculty-subjects"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="block text-sm font-medium text-gray-700">
                    Subjects You Teach
                  </label>

                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                    {(SUBJECTS_MAP[form.department] || []).map((subject) => (
                      <motion.label
                        key={subject}
                        whileHover={{ x: 2 }}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.courses.includes(subject)}
                          onChange={() => handleCheckboxChange(subject)}
                          className="accent-indigo-600 rounded"
                        />
                        {subject}
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Faculty ID */}
              {form.role === "faculty" && (
                <motion.div
                  key="faculty-id"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <InputField
                    label="Faculty ID"
                    name="facultyId"
                    value={form.facultyId}
                    onChange={handleChange}
                  />
                </motion.div>
              )}

              {/* Semester */}
              {form.role === "student" && (
                <motion.div
                  key="student-semester"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
                    Current Semester
                  </label>
                  <select
                    name="semester"
                    value={form.semester}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl bg-white/60 border border-white/40 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all duration-300 shadow-sm"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              variants={itemVariants}
              whileHover={{
                scale: 1.01,
                y: -1,
              }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base tracking-wide mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating unique profile...</span>
                </div>
              ) : (
                "Complete Registration"
              )}
            </motion.button>
          </form>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-500 mt-8"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-5 py-4 rounded-2xl bg-white/60 border border-white/40 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all duration-300 placeholder:text-gray-300 shadow-sm"
      />
    </div>
  );
}
