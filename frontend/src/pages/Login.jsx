import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });

      login(res.data.token, res.data.user);

      const userRole = res.data.user.role;

      // login(res.data.token, res.data.user);

      if (userRole === "admin") {
        navigate("/admin", { replace: true });
      } else if (userRole === "faculty") {
        navigate("/faculty", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error || err.message;

      setError(backendMessage || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative background blobs for Login page */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-300/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-[120px] animate-pulse" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl grid md:grid-cols-2 glass rounded-[2.5rem] shadow-premium overflow-hidden relative z-10"
      >
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
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to DoubtHub
            </h1>
            <p className="text-indigo-100">
              A centralized academic doubt management system designed for
              collaborative learning.
            </p>

            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-6xl drop-shadow-2xl"
            >
              📚
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT SIDE – Form */}
        <div className="p-8 md:p-14 bg-white/40 backdrop-blur-sm">
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center md:text-left"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 tracking-tight">
              Sign In
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-medium">
              Access your personalized academic dashboard
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

            {/* Email */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="yours@example.com"
                value={email}
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
                className="w-full px-5 py-4 rounded-2xl bg-white/60 border border-white/40 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all duration-300 placeholder:text-gray-300 shadow-sm"
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">
                Security Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setError("");
                  setPassword(e.target.value);
                }}
                className="w-full px-5 py-4 rounded-2xl bg-white/60 border border-white/40 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 outline-none transition-all duration-300 placeholder:text-gray-300 shadow-sm"
              />
            </motion.div>

            {/* Submit */}
            <motion.button
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                y: -2,
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-base tracking-wide"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                "Sign In to Dashboard"
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-500 mt-8"
          >
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 font-medium hover:underline"
            >
              Register
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
