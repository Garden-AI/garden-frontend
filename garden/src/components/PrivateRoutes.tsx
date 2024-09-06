import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { LoadingOverlay } from "./LoadingOverlay";

const PrivateRoutes = () => {
  const { isLoading, authorization } = useGlobusAuth();
  const location = useLocation();

  if (isLoading || authorization === undefined) {
    return <LoadingOverlay />;
  }

  if (!authorization.authenticated) {
    localStorage.setItem("loginRedirect", location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
