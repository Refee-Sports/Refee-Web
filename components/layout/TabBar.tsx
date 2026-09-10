"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

type Item = { href: string; icon: IconName; label: string };

const REFEREE_TABS: Item[] = [
  { href: "/app/home", icon: "home", label: "Home" },
  { href: "/app/jobs", icon: "calendar", label: "Jobs" },
  { href: "/app/inbox", icon: "message-square", label: "Inbox" },
  { href: "/app/profile", icon: "user", label: "Profile" },
];

const DIRECTOR_TABS: Item[] = [
  { href: "/director/tournaments", icon: "grid", label: "Tournaments" },
  { href: "/director/messages", icon: "message-square", label: "Messages" },
  { href: "/director/profile", icon: "user", label: "Profile" },
];

/**
 * Bottom tab bar — same items, icons, and colours as the app's tab navigators
 * (refee-mobile/refee/app/(app)/(tabs)/_layout.tsx and the director one).
 * Sticks to the bottom of the phone-width column.
 */
export function TabBar({ role }: { role: "referee" | "director" }) {
  const pathname = usePathname();
  const items = role === "director" ? DIRECTOR_TABS : REFEREE_TABS;

  return (
    <nav
      className="sticky bottom-0 z-20 flex border-t border-ink bg-paper pt-2"
      style={{ paddingBottom: "calc(8px + env(safe-area-inset-bottom))" }}
    >
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-1 flex-col items-center gap-[3px] py-1 ${
              active ? "text-signal" : "text-ink-40 hover:text-ink-60"
            }`}
          >
            <Icon name={item.icon} size={20} />
            <span
              className="font-mono-bold text-[8px] uppercase"
              style={{ letterSpacing: 0.5 }}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
