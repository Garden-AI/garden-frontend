import { Navigate, Outlet } from "react-router-dom";
import { useGlobusAuth } from "./auth/useGlobusAuth";
const PrivateRoutes = () => {
  const auth = useGlobusAuth();

  return auth.authorization ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
