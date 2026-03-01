import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getHomeRoute = () => {
    if (!user) return "/register";
    if (user.role === "admin") return "/admin";
    if (user.role === "faculty") return "/faculty";
    return "/dashboard";
  };

  return (
    <div className="h-screen max-h-screen relative overflow-hidden flex flex-col justify-center">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-32 px-4 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="visible"
          animate="visible"
          className="text-center space-y-8"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest border border-indigo-100 shadow-sm">
              🚀 THE ACADEMIC HUB
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
          >
            Resolve Doubts. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Master Your Future.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium"
          >
            DoubtHub is the ultimate platform for resolving your doubts by your
            teachers according to your syllabus and share study materials for
            your exam preparation.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to={getHomeRoute()}
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-200 hover:scale-105 transition-all active:scale-95"
            >
              Get Started for Free
            </Link>
            <Link
              to="/notes"
              className="w-full sm:w-auto px-10 py-4 bg-white text-gray-700 border border-gray-100 rounded-2xl font-bold shadow-lg hover:bg-gray-50 transition-all active:scale-95"
            >
              📖 Explore Notes
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
