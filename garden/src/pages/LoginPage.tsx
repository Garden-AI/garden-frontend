import { useEffect } from "react";
import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPage() {
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

  const handleLogin = () => {
    const from = location.state?.from?.pathname || "/";
    localStorage.setItem("loginRedirect", from);
    auth.authorization?.login();
  };

  if (auth.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <p className="mb-8 text-xl text-gray-600">You must login to continue.</p>
      <Button
        className={buttonVariants({ variant: "default" })}
        onClick={handleLogin}
      >
        Login
      </Button>
    </div>
  );
}
