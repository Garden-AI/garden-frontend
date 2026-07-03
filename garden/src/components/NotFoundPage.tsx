import { Link } from "react-router-dom";
import { Button, buttonVariants } from "./shadcn/button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <h1 className="mb-4 font-grotesk text-6xl font-bold text-darkSlate">404</h1>
      <p className="mb-8 text-xl text-gray-600">
        Oops! The page you're looking for could not be found.
      </p>
      <Button asChild className={buttonVariants({ variant: "default" })}>
        <Link to="/">Take me home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
