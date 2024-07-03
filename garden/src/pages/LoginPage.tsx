import { useGlobusAuth } from "@/components/auth/useGlobusAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const auth = useGlobusAuth();
  if (auth.authorization) {
    return (
      <Link to="/">
        You are already logged in. Click here to go back to the homepage.
      </Link>
    );
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <p className="mb-8 text-xl text-gray-600">You must login to continue.</p>
      <Button
        className={buttonVariants({ variant: "default" })}
        onClick={() =>
          auth.authorization?.login({
            additionalParams: {},
          })
        }
      >
        Login
      </Button>
    </div>
  );
}
