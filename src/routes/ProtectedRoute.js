import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const {loading, isAuthenticated, role} = useAuth();

  if (loading){
    // console.log("🛡 ProtectedRoute: loading");
    return <Spinner />;
  } 

  if (!isAuthenticated) {
    // console.log("🔒 ProtectedRoute: NOT authenticated → /login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // console.log("🔒 ProtectedRoute: role mismatch", role);  
    return <Navigate to="/" replace />;
  }

  // console.log("🔒 ProtectedRoute: ACCESS GRANTED");
  return <Outlet />;
};

export default ProtectedRoute;
