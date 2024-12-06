import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import useGoogleAnalytics from "src/lib/analytics";

import ScrollToTop from "@/components/ScrollToTop";

import Footer from "./Footer";
import Navbar from "./Navbar";

const RootLayout = () => {
  useGoogleAnalytics();

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <div className="min-h-screen bg-white">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default RootLayout;
