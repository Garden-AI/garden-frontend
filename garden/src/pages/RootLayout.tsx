import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import useGoogleAnalytics from "@/services/analytics";
import { Link, Outlet } from "react-router-dom";
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

      <Link
        to="/garden/create"
        className="fixed bottom-0 right-0 m-2 rounded-lg bg-green p-4 text-white"
      >
        Create Garden
      </Link>
    </>
  );
}
