import type { IconName } from "@/components/ui/Icon";

export type NavRole = "referee" | "director";
export type NavItem = { href: string; icon: IconName; label: string };

/**
 * The app's tab destinations, shared by the mobile TabBar and the desktop
 * SideNav so the two can never drift apart.
 * Mirrors refee-mobile/refee/app/(app)/(tabs)/_layout.tsx and the director one.
 */
export const NAV_ITEMS: Record<NavRole, NavItem[]> = {
  referee: [
    { href: "/app/home", icon: "home", label: "Home" },
    { href: "/app/jobs", icon: "calendar", label: "Jobs" },
    { href: "/app/inbox", icon: "message-square", label: "Inbox" },
    { href: "/app/profile", icon: "user", label: "Profile" },
  ],
  director: [
    { href: "/director/tournaments", icon: "grid", label: "Tournaments" },
    { href: "/director/messages", icon: "message-square", label: "Messages" },
    { href: "/director/profile", icon: "user", label: "Profile" },
  ],
};
