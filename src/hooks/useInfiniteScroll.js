import { useEffect, useRef } from "react";

// Returns a ref to put on an empty <div> below the list.
// When that div scrolls into view, `onReach` is called.
export default function useInfiniteScroll(onReach, enabled) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onReach);
  callbackRef.current = onReach; // always call the latest version

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callbackRef.current();
      },
      { rootMargin: "200px" } // start loading a little early
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}