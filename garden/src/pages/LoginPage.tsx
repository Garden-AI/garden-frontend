import { useGlobusAuth } from "@/components/globus-auth-context/useGlobusAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const auth = useGlobusAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <p className="mb-8 text-xl text-gray-600">You must login to continue.</p>
      <Button
        className={buttonVariants({ variant: "default" })}
        onClick={() => auth.authorization?.login()}
      >
        Login
      </Button>
    </div>
  );
}
