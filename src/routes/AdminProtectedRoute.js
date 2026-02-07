import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { api } from "../Config";

const AdminProtectedRoute = ({ children, allowedRoles = ["admin"] }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check-auth");
        console.log("🛡 AdminProtectedRoute /check-auth:", res.data);
        setAuthenticated(res.data.authenticated);
        setRole(res.data.role?.toLowerCase());
      } catch (err) {
        console.error("🛡 AdminProtectedRoute error:", err);
        setAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading){
    console.log("🛡 AdminProtectedRoute: loading");
    return <Spinner />;
  } 

  if (!authenticated) {
    console.log("🛡 AdminProtectedRoute: NOT authenticated → /login");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    console.log("🛡 AdminProtectedRoute: role mismatch", role);
    return <Navigate to="/" replace />;
  }

  console.log("🛡 AdminProtectedRoute: ACCESS GRANTED");
  return <Outlet />;
};

export default AdminProtectedRoute;
