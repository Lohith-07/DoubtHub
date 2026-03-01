import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { searchAPI } from "../services/api";
import { motion } from "framer-motion";
import DoubtCard from "../components/DoubtCard";
import NotesCard from "../components/NotesCard";
import { NoteSkeleton, AnnouncementSkeleton } from "../components/Skeleton";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState({
    doubts: [],
    notes: [],
    announcements: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      fetchResults();
    }
  }, [query]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await searchAPI.global(query);
      setResults(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!query)
    return (
      <div className="text-center py-20">Please enter a search query.</div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-gray-900">
          Search Results for <span className="text-indigo-600">"{query}"</span>
        </h1>
        <p className="text-gray-500 font-medium tracking-tight">
          Showing matches from across the entire platform
        </p>
      </header>

      {loading ? (
        <div className="space-y-12">
          <section className="space-y-6">
            <div className="h-8 bg-gray-100 w-48 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <NoteSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="space-y-16">
          {/* DOUBTS */}
          {results.doubts.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                  ❓
                </span>
                Doubts & Discussions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.doubts.map((doubt) => (
                  <DoubtCard key={doubt._id} doubt={doubt} />
                ))}
              </div>
            </section>
          )}

          {/* NOTES */}
          {results.notes.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                  📚
                </span>
                Study Materials
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.notes.map((note) => (
                  <NotesCard key={note._id} note={note} />
                ))}
              </div>
            </section>
          )}

          {/* ANNOUNCEMENTS */}
          {results.announcements.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                  📢
                </span>
                Announcements
              </h2>
              <div className="space-y-4">
                {results.announcements.map((ann) => (
                  <div
                    key={ann._id}
                    className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-premium transition-all"
                  >
                    <div className="text-3xl p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                      📢
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 italic">
                        {ann.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-1">
                        {ann.message}
                      </p>
                    </div>
                    <Link
                      to="/announcements"
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.doubts.length === 0 &&
            results.notes.length === 0 &&
            results.announcements.length === 0 && (
              <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-200">
                <span className="text-6xl mb-6 block">🔎</span>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  No results found for "{query}"
                </h3>
                <p className="text-gray-500 font-medium">
                  Try checking your spelling or using more general keywords.
                </p>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
