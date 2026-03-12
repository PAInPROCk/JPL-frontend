import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Config";
import { connectSocket, disconnectSocket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const refreshAuth = async () => {
    try {
      const res = await api.get("/check-auth");

      if (res.data.authenticated) {
        setIsAuthenticated(true);
        setRole(res.data.user.role);
        setUser(res.data.user || null);

        // 🔌 connect socket ONLY after auth
        connectSocket();
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setUser(null);

        disconnectSocket();
      }
    } catch (err) {
      console.error("🔐 AuthContext error:", err);

      setIsAuthenticated(false);
      setRole(null);
      setUser(null);

      disconnectSocket();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      disconnectSocket();

      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth(); // ✅ ONLY place check-auth runs on boot
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        role,
        user,
        refreshAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
