"use client";

import { TabBar } from "@/components/layout/TabBar";
import { SetupNotice } from "@/components/layout/SetupNotice";
import { isSupabaseConfigured } from "@/lib/supabase";

/** Director app shell — mirrors the app's (director)/(tabs) navigator. */
export default function DirectorAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell flex flex-col">
      {!isSupabaseConfigured ? (
        <SetupNotice />
      ) : (
        <>
          <div className="flex flex-1 flex-col">{children}</div>
          <TabBar role="director" />
        </>
      )}
    </div>
  );
}
