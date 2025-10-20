import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";

// Always send cookies for requests
axios.defaults.withCredentials = true;

const ProtectedRoute = ({ children, allowedRoles }) => {
  const API_BASE_URL = process.env.REACT_API_BASE_URL || "http://localhost:5000";
  const [isAuth, setIsAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/check-auth`, {
          withCredentials: true,
        });
        console.log("ProtectedRoute: check-auth result", res.data);
        setIsAuth(res.data.authenticated);
        setUserRole(res.data.role);
      } catch (err) {
        console.error("ProtectedRoute: error", err?.response?.data || err);
        setIsAuth(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading || isAuth === null) {
    return <Spinner />;
  }

  if (!isAuth) {
    // Not logged in at all
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in, but not the right role
    return <Navigate to="/" replace />;
  }

  // All checks passed
  return children;
};

export default ProtectedRoute;
