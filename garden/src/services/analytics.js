import ReactGA from "react-ga4";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TRACKING_ID = "G-99GHD3HEZP"; // May move this to an environment variable later, perhaps different for dev and prod

// Initialize Google Analytics
ReactGA.initialize(TRACKING_ID);

const trackPageView = () => {
  ReactGA.send({
    hitType: "pageview",
    page: window.location.hash,
  });
  // console.log("Page view tracked");
};

const useGoogleAnalytics = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView();
  }, [location]);
};

export default useGoogleAnalytics;
