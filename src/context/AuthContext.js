import { createContext, use, useMemo, useCallback, useEffect, useState } from "react";
import { api } from "../Config";
import { connectSocket, disconnectSocket } from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!user;
  const role = user?.role || null;

  const refreshAuth = useCallback(async () => {
    try {
      const res = await api.get("/check-auth");

      if (res.data.authenticated) {
        setUser(res.data.user || null);

        // 🔌 connect socket ONLY after auth
        connectSocket();
      } else {
        setUser(null);

        disconnectSocket();
      }
    } catch (err) {
      console.error("🔐 AuthContext error:", err);

      setUser(null);

      disconnectSocket();
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      disconnectSocket();

      setUser(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    if (!ignore) {
      refreshAuth();
    }
    return () => {
      ignore = true;
    };
  }, [refreshAuth]);

  const contextValue = useMemo(() => ({
    loading,
    isAuthenticated,
    role,
    user,
    refreshAuth,
    logout,
  }), [loading, isAuthenticated, role, user, refreshAuth, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => use(AuthContext);
