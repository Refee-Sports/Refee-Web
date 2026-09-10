"use client";

import { useEffect } from "react";

/**
 * Web stand-in for expo-router's useFocusEffect.
 *
 * On mobile a screen "regains focus" when you navigate back to it. In the
 * browser the closest equivalents are mount (a route change remounts the page
 * component) and the tab becoming visible again, so we fire on both. Screens
 * rely on this to re-fetch — e.g. the jobs feed dropping a job you just
 * accepted.
 */
export function useFocusEffect(effect: () => void | (() => void)) {
  useEffect(() => {
    let cleanup = effect();

    const rerun = () => {
      if (document.visibilityState !== "visible") return;
      if (typeof cleanup === "function") cleanup();
      cleanup = effect();
    };

    document.addEventListener("visibilitychange", rerun);
    window.addEventListener("focus", rerun);
    return () => {
      document.removeEventListener("visibilitychange", rerun);
      window.removeEventListener("focus", rerun);
      if (typeof cleanup === "function") cleanup();
    };
  }, [effect]);
}
