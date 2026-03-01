import { motion, AnimatePresence } from "framer-motion";

export default function AnnouncementPopup({ announcement, onClose }) {
  if (!announcement) return null;

  const priorityColors = {
    high: "bg-red-600 shadow-red-200",
    medium: "bg-amber-500 shadow-amber-200",
    low: "bg-indigo-600 shadow-indigo-100",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 40 }}
          className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
        >
          {/* Header Priority Bar */}
          <div
            className={`h-2 w-full ${priorityColors[announcement.priority]}`}
          />

          <div className="p-10 md:p-12 text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 shadow-inner animate-bounce">
              📢
            </div>

            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
              {announcement.title}
            </h2>

            <div className="max-h-[30vh] overflow-y-auto mb-10 custom-scrollbar">
              <p className="text-gray-600 text-lg font-medium leading-relaxed">
                {announcement.message}
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all ${priorityColors[announcement.priority]}`}
              >
                Understood
              </motion.button>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                Posted by {announcement.createdBy?.name || "Faculty"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
