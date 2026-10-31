"use client";

import { useEffect, useRef, useState } from "react";

/** Keep decorative work asleep outside the viewport and in background tabs. */
export function useActiveAnimation<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let inView = false;
    const read = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; read(); }, {rootMargin: "80px"});
    observer.observe(element);
    document.addEventListener("visibilitychange", read);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", read); };
  }, []);
  return { ref, active };
}
