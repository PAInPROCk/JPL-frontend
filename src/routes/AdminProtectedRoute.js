import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import axios from "axios";

axios.defaults.withCredentials = true;

const AdminProtectedRoute = ({ children, allowedRoles = ["admin"] }) => {
  const API_BASE_URL = process.env.REACT_API_BASE_URL || "http://localhost:5000";
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/check-auth`, { withCredentials: true });
        console.log("AdminProtectedRoute check-auth response:", res.data);
        setIsAuthenticated(res.data.authenticated);
        setUserRole(res.data.role ? String(res.data.role).toLowerCase(): null);
      } catch (err) {
        console.error("AdminProtectedRoute Auth Error:", err?.response?.data || err);
        setIsAuthenticated(false);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    // Logged in but role is not allowed, redirect to homepage or unauthorized page
    return <Navigate to="/" replace />;
  }

  // Authenticated and role allowed
  return children;
};

export default AdminProtectedRoute;
