import { Navigate, Outlet } from "react-router-dom"
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ allowedRoles = ["admin"] }) => {
  const {loading, isAuthenticated, role} = useAuth();

  if (loading){
    // console.log("🛡 AdminProtectedRoute: loading");
    return <Spinner />;
  } 

  if (!isAuthenticated) {
    // console.log("🛡 AdminProtectedRoute: NOT authenticated → /login");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.map(r => r.toLowerCase()).includes(role)) {
    // console.log("🛡 AdminProtectedRoute: role mismatch", role);
    return <Navigate to="/" replace />;
  }

  // console.log("🛡 AdminProtectedRoute: ACCESS GRANTED");
  return <Outlet />;
};

export default AdminProtectedRoute;
