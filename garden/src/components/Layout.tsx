import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import useGoogleAnalytics from "src/lib/analytics";

import ScrollToTop from "@/components/ScrollToTop";
import { useBackgroundDataPreloader } from "@/hooks/useBackgroundDataPreloader";

import Footer from "./Footer";
import Navbar from "./Navbar";

const RootLayout = () => {
  // Background preload frequently used data (can be disabled via env var)
  const enablePreloading = import.meta.env.VITE_ENABLE_BACKGROUND_PRELOADING !== 'false';
  useBackgroundDataPreloader(enablePreloading);
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
