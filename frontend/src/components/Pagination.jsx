import { motion } from "framer-motion";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all"
      >
        ←
      </button>

      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
            currentPage === page
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
              : "bg-white border border-gray-100 text-gray-500 hover:border-indigo-100 hover:text-indigo-600 shadow-sm"
          }`}
        >
          {page}
        </motion.button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all"
      >
        →
      </button>
    </div>
  );
}
