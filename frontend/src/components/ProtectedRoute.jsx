import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ role }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    const roleHomes = {
      admin: "/admin",
      faculty: "/faculty",
      student: "/dashboard",
    };
    return <Navigate to={roleHomes[user.role] || "/login"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
