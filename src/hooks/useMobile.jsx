import { useState, useEffect } from "react";

const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < breakpoint);

    // Check on initial load
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Clean up the event listener on unmount
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};

export default useMobile;
