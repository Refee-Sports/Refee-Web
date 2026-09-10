"use client";

import { TabBar } from "@/components/layout/TabBar";
import { SetupNotice } from "@/components/layout/SetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Referee app shell — the web equivalent of the app's (app)/(tabs) navigator.
 * Refee is mobile-first, so the signed-in app keeps the phone-width column on
 * every screen size rather than sprawling into a desktop layout.
 */
export default function RefereeAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex flex-col">
      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : (
        <>
          <div className="flex flex-1 flex-col">{children}</div>
          <TabBar role="referee" />
        </>
      )}
    </div>
  );
}
