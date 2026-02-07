import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { api } from "../Config";

const ProtectedRoute = ({ allowedRoles }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/check-auth");
        setAuthenticated(res.data.authenticated);
        setRole(res.data.role);
      } catch {
        setAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading){
    console.log("🛡 ProtectedRoute: loading");
    return <Spinner />;
  } 

  if (!authenticated) {
    console.log("🔒 ProtectedRoute: NOT authenticated → /login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    console.log("🔒 ProtectedRoute: role mismatch", role);  
    return <Navigate to="/" replace />;
  }

  console.log("🔒 ProtectedRoute: ACCESS GRANTED");
  return <Outlet />;
};

export default ProtectedRoute;
