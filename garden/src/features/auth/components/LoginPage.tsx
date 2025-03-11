import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Button, buttonVariants } from "@/components/shadcn/button";
import { useGlobusAuth } from "@globus/react-auth-context";

const LoginPage = () => {
  const auth = useGlobusAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      const redirectPath = localStorage.getItem("loginRedirect") || "/";
      localStorage.removeItem("loginRedirect");
      navigate(redirectPath, { replace: true });
      console.log("Redirecting to", redirectPath);
    }
  }, [auth.authorization, navigate]);

  const handleLogin = async () => {
    const from = location.state?.from?.pathname || "/";
    localStorage.setItem("loginRedirect", from);
    await auth.authorization?.login();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <p className="mb-8 text-xl text-gray-600">You must login to continue.</p>
      <Button className={buttonVariants({ variant: "default" })} onClick={handleLogin}>
        Login
      </Button>
    </div>
  );
};

export default LoginPage;
