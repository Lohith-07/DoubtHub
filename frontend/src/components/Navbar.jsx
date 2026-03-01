import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { adminAPI, notificationAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout, socket } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const getHomeRoute = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "faculty") return "/faculty";
    return "/dashboard";
  };

  useEffect(() => {
    if (user?.role === "admin") {
      adminAPI
        .getStats()
        .then((res) => {
          setPendingCount(res.data.pendingFaculty || 0);
        })
        .catch(() => {});
    }

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on("newNotification", (data) => {
        fetchNotifications();
      });

      return () => {
        socket.off("newNotification");
      };
    }
  }, [socket]);

  const fetchNotifications = async () => {
    try {
      const res = await notificationAPI.getAll();
      setNotifications(res.data.data);
      setUnreadNotificationsCount(
        res.data.data.filter((n) => !n.isRead).length,
      );
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        !event.target.closest("#profile-dropdown-container")
      ) {
        setDropdownOpen(false);
      }
      if (
        notificationDropdownOpen &&
        !event.target.closest("#notification-dropdown-container")
      ) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, notificationDropdownOpen]);

  const roleColor = {
    admin: "bg-purple-100 text-purple-700",
    faculty: "bg-emerald-100 text-emerald-700",
    student: "bg-gray-100 text-gray-600",
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100 shadow-sm relative"
    >
      {/* Dynamic Gradient Top-Bar */}
      <motion.div
        animate={{
          background: [
            "linear-gradient(to right, #818cf8, #c084fc, #f472b6)",
            "linear-gradient(to right, #f472b6, #818cf8, #c084fc)",
            "linear-gradient(to right, #c084fc, #f472b6, #818cf8)",
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[3px] opacity-40 blur-[1px]"
      />

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* LEFT: Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <Link
            to={getHomeRoute()}
            className="flex items-center gap-3 group shrink-0"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md"
              id="navbar-logo"
            >
              DH
            </motion.div>
            <motion.span
              whileHover={{ x: 2 }}
              className="hidden md:block text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight"
            >
              DoubtHub
            </motion.span>
          </Link>

          {/* Desktop Nav Links */}
          {!["/login", "/register"].includes(location.pathname) && (
            <div className="hidden md:flex items-center gap-1">
              {user && (
                <>
                  <NavLink
                    to={getHomeRoute()}
                    active={
                      location.pathname === getHomeRoute() ||
                      (location.pathname === "/dashboard" &&
                        !location.search.includes("filter=my"))
                    }
                  >
                    Dashboard
                  </NavLink>
                  {user.role === "student" && (
                    <NavLink
                      to="/dashboard?filter=my"
                      active={location.search.includes("filter=my")}
                    >
                      My Doubts
                    </NavLink>
                  )}
                  {user.role === "faculty" && (
                    <NavLink
                      to="/faculty?filter=assigned"
                      active={
                        location.pathname === "/faculty" &&
                        location.search.includes("filter=assigned")
                      }
                    >
                      Assigned To Me
                    </NavLink>
                  )}
                  <NavLink to="/notes" active={location.pathname === "/notes"}>
                    📚 Notes
                  </NavLink>
                  <NavLink
                    to="/announcements"
                    active={location.pathname === "/announcements"}
                  >
                    📢 Announcements
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>

        {/* MIDDLE: Search Bar */}
        {user && !["/login", "/register"].includes(location.pathname) && (
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-md hidden lg:flex relative"
          >
            <input
              type="text"
              placeholder="Search doubts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 rounded-2xl px-10 py-2 text-sm transition-all outline-none"
              id="navbar-search-input"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </form>
        )}

        {/* RIGHT SECTION */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Student Create Shortcut */}
            {user.role === "student" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/doubts/new"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  id="navbar-create-doubt"
                >
                  <span className="sm:hidden">+</span>
                  <span className="hidden sm:inline">+ Create Doubt</span>
                </Link>
              </motion.div>
            )}

            {/* Notification Bell */}
            <div className="relative" id="notification-dropdown-container">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setNotificationDropdownOpen(!notificationDropdownOpen)
                }
                className="w-10 h-10 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center relative shadow-sm border border-transparent hover:border-indigo-200 transition-all"
              >
                <span className="text-xl">🔔</span>
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {unreadNotificationsCount > 9
                      ? "9+"
                      : unreadNotificationsCount}
                  </span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-[70]"
                  >
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Notifications</h3>
                      {unreadNotificationsCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n._id}
                            onClick={() => {
                              markAsRead(n._id);
                              navigate(`/doubts/${n.doubt?._id}`);
                              setNotificationDropdownOpen(false);
                            }}
                            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-indigo-50/50 ${!n.isRead ? "bg-indigo-50/30" : ""}`}
                          >
                            <div className="flex gap-3">
                              <div
                                className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.isRead ? "bg-indigo-500" : "bg-transparent"}`}
                              />
                              <div>
                                <p
                                  className={`text-sm ${!n.isRead ? "font-bold text-gray-900" : "text-gray-600"}`}
                                >
                                  {n.message}
                                </p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">
                                  {new Date(n.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-400">
                          <p className="text-xl mb-2">📭</p>
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Quick Action */}
            {user.role === "admin" && pendingCount > 0 && (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100 hover:bg-red-100 transition-all"
              >
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {pendingCount} Pending
              </Link>
            )}

            {/* Profile Dropdown */}
            <div className="relative" id="profile-dropdown-container">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shadow-sm border-2 border-white pointer-events-auto"
                id="navbar-profile-button"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-4 space-y-4 z-[60]"
                  >
                    <div className="px-2">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate mb-2">
                        {user.email}
                      </p>
                      <span
                        className={`inline-block text-[10px] uppercase tracking-wider font-heavy px-2 py-0.5 rounded-lg ${roleColor[user.role]}`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <div className="border-t border-gray-100" />

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all"
                      >
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                        id="navbar-logout-button"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-indigo-700 transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </Link>
  );
}
