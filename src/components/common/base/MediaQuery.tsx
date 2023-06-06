import { useEffect, useState } from "react";

const useMediaQuery = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    const handleChange = () => {
      setMatches(!!matchMedia.matches);
    };
    //triggered at the first client-side load and if query changes
    handleChange();

    matchMedia.addEventListener("change", handleChange); // updated from .addListener

    return () => {
      matchMedia.removeEventListener("change", handleChange); // updated from .removeListener
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
};

const MediaQuery = () => {
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const isLaptop = useMediaQuery("(min-width: 992px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTabletOrMobile = useMediaQuery("(max-width: 992px)");

  return {
    isDesktop,
    isLaptop,
    isTablet,
    isMobile,
    isTabletOrMobile,
  };
};

export default MediaQuery;
