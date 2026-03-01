import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("cdd_token");

    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:5001/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const userData = res.data.user;
        if (userData && userData.id && !userData._id) {
          userData._id = userData.id;
        }
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("cdd_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && !socket) {
      const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});
      newSocket.emit("join", user._id || user.id);
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [user]);

  const login = (token, userData) => {
    localStorage.setItem("cdd_token", token);
    if (userData && userData.id && !userData._id) {
      userData._id = userData.id;
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("cdd_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
