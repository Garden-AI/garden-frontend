import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoutes = () => {
  const { isLoading, authorization } = useGlobusAuth();
  const location = useLocation();

  if (isLoading || authorization === undefined) {
    return <LoadingSpinner />;
  }

  if (!authorization.authenticated) {
    localStorage.setItem("loginRedirect", location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
