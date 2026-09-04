import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();

  // Context not ready yet
  if (!auth) return null;

  const { user, loading } = auth;

  // Still checking auth
  if (loading) return null;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;
