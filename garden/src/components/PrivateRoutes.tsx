import { Navigate, Outlet } from "react-router-dom";
import { useGlobusAuth } from "./globus-auth-context/useGlobusAuth";
const PrivateRoutes = () => {
  const auth = useGlobusAuth();
  console.log(auth);
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
