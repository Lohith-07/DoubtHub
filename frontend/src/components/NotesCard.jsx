import { motion } from "framer-motion";

export default function NotesCard({ note, user, onDelete }) {
  const isOwner = note.uploadedBy?._id === user?._id;
  const isAdmin = user?.role === "admin";

  const getFileIcon = (fileName) => {
    if (fileName.endsWith(".pdf")) return "📄";
    if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) return "📝";
    if (fileName.endsWith(".ppt") || fileName.endsWith(".pptx")) return "📊";
    return "📁";
  };

  const getFileBadge = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const colors = {
      pdf: "bg-red-100 text-red-600 border-red-200",
      doc: "bg-blue-100 text-blue-600 border-blue-200",
      docx: "bg-blue-100 text-blue-600 border-blue-200",
      ppt: "bg-orange-100 text-orange-600 border-orange-200",
      pptx: "bg-orange-100 text-orange-600 border-orange-200",
      default: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return colors[ext] || colors.default;
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px -15px rgba(0,0,0,0.1)" }}
      className="bg-white rounded-[2.5rem] p-7 border border-gray-100 shadow-sm relative overflow-hidden group transition-all duration-300"
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 opacity-50" />

      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
            Sem {note.semester}
          </span>
          {note.role === "faculty" && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
              Verified
            </span>
          )}
        </div>
        {(isAdmin || isOwner) && (
          <button
            onClick={() => onDelete(note._id)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
            title="Delete Note"
          >
            <span className="text-xl">🗑️</span>
          </button>
        )}
      </div>

      <div className="relative z-10 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
            {note.title}
          </h3>
          <p className="text-sm font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            {note.subject}
          </p>
        </div>

        <div className="flex items-center gap-3 py-4 border-y border-gray-50">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            {note.uploadedBy?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Uploaded By
            </p>
            <p className="text-sm font-bold text-gray-900 leading-none mt-1">
              {note.uploadedBy?.name || "Unknown"}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {note.files.map((file, idx) => {
            // Robust check for file data
            const hasFileId =
              file.fileId || (typeof file === "object" && file._id);
            const fileId = file.fileId || file._id;

            if (!hasFileId) {
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-3xl bg-red-50/30 border border-red-50"
                >
                  <span className="text-lg">⚠️</span>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-red-800 truncate">
                      {file.fileName}
                    </p>
                    <p className="text-[10px] text-red-400 font-medium">
                      Incompatible data format
                    </p>
                  </div>
                </div>
              );
            }

            const fileUrl = `http://localhost:5001/api/notes/file/${fileId}`;

            return (
              <a
                key={idx}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 border border-transparent hover:border-indigo-100 transition-all duration-300 group/file"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl border ${getFileBadge(file.fileName)}`}
                >
                  {getFileIcon(file.fileName)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-gray-900 truncate group-hover/file:text-indigo-600 transition-colors">
                    {file.fileName}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
                    Click to Open
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center opacity-0 group-hover/file:opacity-100 transition-opacity shadow-sm">
                  <span className="text-xs">➡️</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
