import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ component: Component, roles, ...rest }) {
  const { isAuthenticated, loading, user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <div className="page-loading">Chargement du profil...</div>;
        }

        if (!isAuthenticated) {
          return <Redirect to="/login" />;
        }

        if (roles && !roles.includes(user.role)) {
          return <Redirect to="/dashboard" />;
        }

        return <Component {...props} />;
      }}
    />
  );
}

export default ProtectedRoute;
