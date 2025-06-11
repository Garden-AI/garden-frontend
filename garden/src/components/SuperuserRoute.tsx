import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobusAuth } from "@globus/react-auth-context";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { SUPER_USERS } from "@/utils/utils";

/**
 * Route wrapper that only allows superusers to access protected routes
 * Redirects non-superusers to the home page
 */
const SuperuserRoute: React.FC = () => {
  const { authorization } = useGlobusAuth();
  const location = useLocation();

  if (authorization === undefined) {
    return <LoadingOverlay />;
  }

  if (!authorization.authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isSuperUser = SUPER_USERS.includes(authorization.user?.sub || "");
  
  if (!isSuperUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default SuperuserRoute;