import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../Config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  const refreshAuth = async () => {
    try {
      const res = await api.get("/check-auth");
      // console.log("🔐 AuthContext /check-auth:", res.data);

      if (res.data.authenticated) {
        setIsAuthenticated(true);
        setRole(res.data.role);
        setUser(res.data.user || null);
      } else {
        setIsAuthenticated(false);
        setRole(null);
        setUser(null);
      }
    } catch (err) {
      console.error("🔐 AuthContext error:", err);
      setIsAuthenticated(false);
      setRole(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/logout"); // we’ll add this later
    } catch (err){
      console.error("Logout error:",err);
    } finally{
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    }
  };

  useEffect(() => {
    refreshAuth(); // 🔥 ONLY place check-auth is called
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
