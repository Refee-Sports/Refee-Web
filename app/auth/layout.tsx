"use client";

import { usePathname } from "next/navigation";

/**
 * Auth shell.
 *
 * Sign-in, verify and callback are short forms, so they sit in the centred
 * `.form-shell` card. Welcome is the front door — a full-bleed hero that runs
 * edge to edge on desktop — so it opts out and manages its own layout.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullBleed = pathname?.startsWith("/auth/welcome");

  if (fullBleed) return <>{children}</>;

  return <div className="form-shell flex flex-col">{children}</div>;
}
