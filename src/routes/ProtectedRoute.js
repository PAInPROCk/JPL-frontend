import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

  if (!isLoggedIn && !isAdminLoggedIn) {
    return <Navigate to="/login" replace/>;
  }

  return children;
};

export default ProtectedRoute;
