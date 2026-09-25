import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets scroll to top on every route change — without this, navigating from
// a scrolled page (e.g. footer link) lands the new page mid-scroll.
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
