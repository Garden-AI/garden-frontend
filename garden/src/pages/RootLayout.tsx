import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import useGoogleAnalytics from "@/services/analytics";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

export default function RootLayout() {
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
}
