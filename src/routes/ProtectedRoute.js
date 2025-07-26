import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  if (!isLoggedIn || !isAdminLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
