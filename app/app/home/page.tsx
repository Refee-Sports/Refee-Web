"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { ZebraRule } from "@/components/ui/ZebraRule";
import { Spinner } from "@/components/ui/AppButton";
import { useFocusEffect } from "@/hooks/useFocusEffect";
import { supabase } from "@/lib/supabase";
import { fetchMyProfile, type ProfileRow } from "@/lib/profile/queries";
import {
  fetchEarningsSummary,
  fetchMyAssignments,
  type AssignmentRow,
  type EarningsSummary,
} from "@/lib/home/queries";

const TZ = "America/Chicago";

function formatCardDate(iso: string): string {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("en-US", { weekday: "short", timeZone: TZ }).toUpperCase();
  const md = d
    .toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: TZ })
    .toUpperCase();
  return `${weekday} · ${md}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "GOOD MORNING";
  if (h < 17) return "GOOD AFTERNOON";
  return "GOOD EVENING";
}

/** Port of refee-mobile/refee/app/(app)/(tabs)/index.tsx. */
export default function RefereeHomePage() {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [todayGames, setTodayGames] = useState<AssignmentRow[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<AssignmentRow[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary>({
    paidThisMonth: 0,
    pendingTotal: 0,
    gamesThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      (async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session || cancelled) return;
        const uid = session.user.id;

        // Fallback for pg_cron: auto-completes games 24h past their end.
        void supabase.rpc("sweep_game_lifecycle");

        const [profileRes, assignRes, earningsRes] = await Promise.all([
          fetchMyProfile(uid),
          fetchMyAssignments(uid),
          fetchEarningsSummary(uid),
        ]);

        if (cancelled) return;
        setProfile(profileRes.data as ProfileRow | null);
        setTodayGames(assignRes.today);
        setUpcomingGames(assignRes.upcoming);
        setEarnings(earningsRes.summary);
        setLoading(false);
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const monthName = new Date().toLocaleDateString("en-US", { month: "long" }).toUpperCase();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-paper text-signal">
        <Spinner />
      </div>
    );
  }

  const firstName = profile?.first_name.toUpperCase() ?? "REF";

  return (
    <div className="flex-1 bg-paper pb-6">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3">
        <Wordmark className="text-[26px]" />
        <span className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${profile?.is_available ? "bg-court" : "bg-ink-20"}`}
          />
          <span
            className={`font-mono-bold text-[9px] uppercase ${
              profile?.is_available ? "text-court" : "text-ink-40"
            }`}
            style={{ letterSpacing: 1.5 }}
          >
            {profile?.is_available ? "Available" : "Unavailable"}
          </span>
        </span>
      </div>
      <ZebraRule noMargin />

      {/* Greeting */}
      <div className="border-b border-ink-20 px-5 pb-4 pt-5">
        <p
          className="mb-1 font-mono-bold text-[10px] uppercase text-signal"
          style={{ letterSpacing: 2 }}
        >
          {getGreeting()}
        </p>
        <h1
          className="font-display text-ink"
          style={{ fontSize: 36, lineHeight: "34px", letterSpacing: -1.5 }}
        >
          {firstName}.
        </h1>
      </div>

      {/* Today */}
      <SectionHeader>Today</SectionHeader>
      <div className="mx-5 flex flex-col gap-3">
        {todayGames.length === 0 ? (
          <EmptyState message={"No games on the schedule today.\nCheck the jobs feed."} />
        ) : (
          todayGames.map((r) => <AssignmentCard key={r.id} row={r} />)
        )}
      </div>

      {/* Upcoming */}
      {upcomingGames.length > 0 && (
        <>
          <SectionHeader>Upcoming</SectionHeader>
          <div className="mx-5 flex flex-col gap-3">
            {upcomingGames.slice(0, 3).map((r) => (
              <AssignmentCard key={r.id} row={r} />
            ))}
          </div>
        </>
      )}

      {/* Earnings */}
      <SectionHeader>{`Earnings · ${monthName}`}</SectionHeader>
      <div className="mx-5 border border-ink-20 bg-chalk">
        <div className="flex border-b border-ink-20">
          <EarningsCell label="Paid" value={earnings.paidThisMonth} bordered />
          <EarningsCell label="Pending" value={earnings.pendingTotal} />
        </div>
        <div className="px-4 py-3">
          <span
            className="font-mono text-[9px] uppercase text-ink-40"
            style={{ letterSpacing: 1.5 }}
          >
            {earnings.gamesThisMonth} GAME{earnings.gamesThisMonth !== 1 ? "S" : ""} THIS MONTH
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <SectionHeader>Quick actions</SectionHeader>
      <div className="mx-5 mb-4 flex flex-col gap-2">
        <QuickAction label="Browse open jobs" href="/app/jobs" />
        <QuickAction label="View my profile" href="/app/profile" />
      </div>
    </div>
  );
}

function AssignmentCard({ row }: { row: AssignmentRow }) {
  const org = row.job.hirers?.org_name.toUpperCase() ?? "ORGANIZER";
  const pay = row.job.pay_per_game * row.job.num_games;

  return (
    <Link
      href={`/app/job/${row.job.id}`}
      className="block border border-ink-20 bg-chalk hover:opacity-80"
    >
      <div className="px-4 pb-1 pt-3.5">
        <span
          className="block font-display text-ink"
          style={{ fontSize: 20, letterSpacing: -0.5, lineHeight: "22px" }}
        >
          {row.job.title.toUpperCase()}
        </span>
        <span
          className="mt-1 block font-mono-bold text-[9px] uppercase text-ink-60"
          style={{ letterSpacing: 1.5 }}
        >
          {org}
        </span>
      </div>
      <div className="mt-2 flex border-t border-ink-20">
        <CardCell
          label="When"
          primary={formatCardDate(row.job.starts_at)}
          secondary={formatTime(row.job.starts_at)}
          bordered
        />
        <CardCell
          label="Where"
          primary={row.job.venue_name.toUpperCase()}
          secondary={`${row.job.venue_city}, ${row.job.venue_state}`}
          bordered
        />
        <div className="flex flex-col items-end justify-center px-4 py-2.5">
          <span
            className="mb-0.5 font-mono-bold text-[8px] uppercase text-ink-40"
            style={{ letterSpacing: 1.5 }}
          >
            Pay
          </span>
          <span className="font-display text-ink" style={{ fontSize: 18, letterSpacing: -0.5 }}>
            ${pay}
          </span>
        </div>
      </div>
    </Link>
  );
}

function CardCell({
  label,
  primary,
  secondary,
  bordered,
}: {
  label: string;
  primary: string;
  secondary: string;
  bordered?: boolean;
}) {
  return (
    <div className={`min-w-0 flex-1 px-4 py-2.5 ${bordered ? "border-r border-ink-20" : ""}`}>
      <span
        className="mb-0.5 block font-mono-bold text-[8px] uppercase text-ink-40"
        style={{ letterSpacing: 1.5 }}
      >
        {label}
      </span>
      <span
        className="block truncate font-mono-bold text-[10px] uppercase text-ink"
        style={{ letterSpacing: 0.5 }}
      >
        {primary}
      </span>
      <span
        className="mt-0.5 block truncate font-mono text-[9px] uppercase text-ink-60"
        style={{ letterSpacing: 0.5 }}
      >
        {secondary}
      </span>
    </div>
  );
}

function EarningsCell({
  label,
  value,
  bordered,
}: {
  label: string;
  value: number;
  bordered?: boolean;
}) {
  return (
    <div className={`flex-1 px-4 py-4 ${bordered ? "border-r border-ink-20" : ""}`}>
      <span
        className="mb-1 block font-mono-bold text-[9px] uppercase text-ink-60"
        style={{ letterSpacing: 1.5 }}
      >
        {label}
      </span>
      <span className="font-display text-ink" style={{ fontSize: 28, letterSpacing: -1 }}>
        ${value.toLocaleString()}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center border border-dashed border-ink-20 px-5 py-6">
      <p
        className="whitespace-pre-line text-center font-mono text-[10px] uppercase text-ink-40"
        style={{ letterSpacing: 1.5 }}
      >
        {message}
      </p>
    </div>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <h2
      className="mx-5 mb-3 mt-6 font-mono-bold text-[9px] uppercase text-ink-60"
      style={{ letterSpacing: 2 }}
    >
      {children}
    </h2>
  );
}

function QuickAction({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border border-ink-20 bg-chalk px-4 py-3.5 hover:opacity-80"
    >
      <span
        className="font-mono-bold text-[11px] uppercase text-ink"
        style={{ letterSpacing: 1.5 }}
      >
        {label}
      </span>
      <span className="font-mono text-[11px] text-ink-40">→</span>
    </Link>
  );
}
