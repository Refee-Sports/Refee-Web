"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Wordmark } from "@/components/Wordmark";
import { ZebraRule } from "@/components/ui/ZebraRule";
import { Icon } from "@/components/ui/Icon";
import { Spinner } from "@/components/ui/AppButton";
import { useFocusEffect } from "@/hooks/useFocusEffect";
import { supabase } from "@/lib/supabase";
import {
  fetchGamesNeedingCompletion,
  fetchMyTournaments,
  fetchStandaloneGames,
  type DirectorGameRow,
  type NeedsCompletionRow,
  type TournamentRow,
} from "@/lib/director/queries";
import { runAutoPay } from "@/lib/payments/queries";

const STATUS_COLORS: Record<string, string> = {
  open: "#1F4FCC",
  staffed: "#00A85C",
  completed: "rgba(8,17,28,0.40)",
  cancelled: "#E53E3E",
};

function formatDate(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Chicago",
    })
    .toUpperCase();
}

/** Port of refee-mobile/refee/app/(director)/(tabs)/tournaments.tsx. */
export default function DirectorTournamentsPage() {
  const [tournaments, setTournaments] = useState<TournamentRow[]>([]);
  const [singleGames, setSingleGames] = useState<DirectorGameRow[]>([]);
  const [needsCompletion, setNeedsCompletion] = useState<NeedsCompletionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoPayNote, setAutoPayNote] = useState<string | null>(null);

  const load = useCallback(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        if (!cancelled) setLoading(false);
        return;
      }

      // Fallback for pg_cron: auto-completes games 24h past their end, then
      // auto-pays freshly-completed games if a card is on file.
      void supabase.rpc("sweep_game_lifecycle").then(() => {
        void runAutoPay().then(({ result }) => {
          if (cancelled || !result || result.paid.length === 0) return;
          const total = result.paid.reduce((s, p) => s + p.total, 0);
          setAutoPayNote(
            `${result.paid.length} completed game${
              result.paid.length !== 1 ? "s" : ""
            } charged ($${total} total) and referees paid.`
          );
        });
      });

      const [{ tournaments: rows, error: fetchErr }, nudge, { games: solo }] =
        await Promise.all([
          fetchMyTournaments(session.user.id),
          fetchGamesNeedingCompletion(session.user.id),
          fetchStandaloneGames(session.user.id),
        ]);

      if (cancelled) return;
      setTournaments(rows);
      setNeedsCompletion(nudge);
      setSingleGames(solo);
      if (fetchErr) setError(fetchErr.message);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(load);

  return (
    <div className="flex flex-1 flex-col bg-paper pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 pt-1">
        <Wordmark className="text-[26px]" />
        <NewMenu />
      </div>

      {/* Telemetry */}
      <div className="px-5 pb-1.5">
        <span className="font-mono text-[9px] uppercase text-ink-60" style={{ letterSpacing: 2 }}>
          <span className="font-mono-bold text-ink">TOURNAMENTS</span>
          {` · ${tournaments.length} TOTAL`}
        </span>
      </div>
      <div className="mb-4 px-5">
        <ZebraRule variant="signal" thin />
      </div>

      {autoPayNote ? (
        <div className="mx-5 mb-4 border border-court bg-court/10 px-4 py-3">
          <p
            className="font-mono-bold text-[10px] uppercase text-court"
            style={{ letterSpacing: 1.5 }}
          >
            Crews paid automatically
          </p>
          <p className="mt-1 font-mono text-[10px] text-ink-80">{autoPayNote}</p>
        </div>
      ) : null}

      {/* Completion nudge — games ended but not yet closed out */}
      {needsCompletion.length > 0 && (
        <div className="mx-5 mb-4 border border-ink bg-hi-vis">
          <div className="flex items-center gap-2 border-b border-ink/20 px-4 py-2.5">
            <Icon name="alert-circle" size={13} />
            <span
              className="font-mono-bold text-[10px] uppercase text-ink"
              style={{ letterSpacing: 1.5 }}
            >
              {needsCompletion.length} GAME{needsCompletion.length !== 1 ? "S" : ""} NEED CLOSING OUT
            </span>
          </div>
          {needsCompletion.slice(0, 4).map((g) => (
            <Link
              key={g.id}
              href={`/director/game/${g.id}`}
              className="flex items-center justify-between border-b border-ink/10 px-4 py-2.5 hover:opacity-70"
            >
              <span className="min-w-0 flex-1 pr-2">
                <span
                  className="block truncate font-mono-bold text-[11px] uppercase text-ink"
                  style={{ letterSpacing: 0.5 }}
                >
                  {g.title}
                </span>
                <span
                  className="block font-mono text-[9px] uppercase text-ink/60"
                  style={{ letterSpacing: 1 }}
                >
                  {g.acceptedCount} REF{g.acceptedCount !== 1 ? "S" : ""} · MARK COMPLETE TO PAY
                </span>
              </span>
              <Icon name="chevron-right" size={14} />
            </Link>
          ))}
          <p
            className="px-4 py-2 font-mono text-[8px] uppercase text-ink/50"
            style={{ letterSpacing: 1 }}
          >
            Auto-completes 24h after game end if not done
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-signal">
          <Spinner />
        </div>
      ) : (
        <div className="px-5">
          {tournaments.length === 0 && singleGames.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-2">
              {tournaments.map((t) => (
                <TournamentCard key={t.id} tournament={t} />
              ))}
            </div>
          )}

          {singleGames.length > 0 && (
            <div className="mt-5">
              <h2
                className="mb-3 font-mono-bold text-[10px] uppercase text-ink"
                style={{ letterSpacing: 2.5 }}
              >
                ── Single games ({singleGames.length})
              </h2>
              <div className="flex flex-col gap-2">
                {singleGames.map((g) => (
                  <SingleGameCard key={g.id} game={g} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p
          className="mb-4 px-5 text-center font-mono text-xs text-foul"
          style={{ letterSpacing: 0.5 }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

/** The app uses an action sheet here; on web a small popover menu reads better. */
function NewMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-9 items-center justify-center gap-1.5 bg-ink px-3 text-paper hover:opacity-80"
      >
        <Icon name="plus" size={14} />
        <span className="font-mono-bold text-[10px] uppercase" style={{ letterSpacing: 1.5 }}>
          New
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-30 w-44 border border-ink bg-chalk shadow-[4px_4px_0_var(--ink)]">
          <Link
            href="/director/tournament/create"
            onClick={() => setOpen(false)}
            className="block border-b border-ink-20 px-4 py-3 font-mono-bold text-[10px] uppercase text-ink hover:bg-ink hover:text-paper"
            style={{ letterSpacing: 1.5 }}
          >
            Tournament
          </Link>
          <Link
            href="/director/game/create"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 font-mono-bold text-[10px] uppercase text-ink hover:bg-ink hover:text-paper"
            style={{ letterSpacing: 1.5 }}
          >
            Single game
          </Link>
        </div>
      )}
    </div>
  );
}

function TournamentCard({ tournament }: { tournament: TournamentRow }) {
  const statusColor = STATUS_COLORS[tournament.status] ?? "rgba(8,17,28,0.40)";
  return (
    <Link
      href={`/director/tournament/${tournament.id}`}
      className="block border border-ink bg-chalk hover:opacity-75"
    >
      <div className="h-1" style={{ backgroundColor: statusColor }} />
      <div className="px-4 pb-4 pt-3">
        <div className="mb-1 flex items-start justify-between">
          <span
            className="flex-1 pr-2 font-display text-ink"
            style={{ fontSize: 20, letterSpacing: -0.5, lineHeight: "22px" }}
          >
            {tournament.name.toUpperCase()}
          </span>
          <span
            className="font-mono-bold text-[9px] uppercase"
            style={{ letterSpacing: 1.5, color: statusColor, marginTop: 2 }}
          >
            {tournament.status}
          </span>
        </div>
        <span
          className="block font-mono text-[10px] uppercase text-ink-60"
          style={{ letterSpacing: 1 }}
        >
          {tournament.venue_city.toUpperCase()}, {tournament.venue_state}
        </span>
        <div className="mt-3 flex items-center gap-3">
          <DataPill label="Start" value={formatDate(tournament.starts_on)} />
          <DataPill label="End" value={formatDate(tournament.ends_on)} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-ink-20 px-4 py-2.5">
        <span
          className="font-mono text-[9px] uppercase text-ink-40"
          style={{ letterSpacing: 1.5 }}
        >
          Basketball · Direct hire
        </span>
        <span className="text-ink-40">
          <Icon name="chevron-right" size={14} />
        </span>
      </div>
    </Link>
  );
}

function SingleGameCard({ game }: { game: DirectorGameRow }) {
  const statusColor = STATUS_COLORS[game.status] ?? "rgba(8,17,28,0.40)";
  const title =
    game.home_team && game.away_team ? `${game.home_team} vs ${game.away_team}` : game.title;
  return (
    <Link href={`/director/game/${game.id}`} className="block border border-ink bg-chalk hover:opacity-75">
      <div className="h-1" style={{ backgroundColor: statusColor }} />
      <div className="px-4 pb-3 pt-3">
        <div className="mb-1 flex items-start justify-between">
          <span
            className="min-w-0 flex-1 truncate pr-2 font-mono-bold text-[12px] uppercase text-ink"
            style={{ letterSpacing: 0.5 }}
          >
            {title.toUpperCase()}
          </span>
          <span
            className="shrink-0 font-mono-bold text-[8px] uppercase"
            style={{ letterSpacing: 1.5, color: statusColor }}
          >
            {game.status}
          </span>
        </div>
        <span
          className="block font-mono text-[10px] uppercase text-ink-60"
          style={{ letterSpacing: 1 }}
        >
          {game.venue_city.toUpperCase()}, {game.venue_state} · ${game.pay_per_game}/REF
        </span>
      </div>
    </Link>
  );
}

function DataPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span
        className="mb-0.5 block font-mono text-[8px] uppercase text-ink-40"
        style={{ letterSpacing: 1.5 }}
      >
        {label}
      </span>
      <span
        className="block font-mono-bold text-[10px] uppercase text-ink"
        style={{ letterSpacing: 0.5 }}
      >
        {value}
      </span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
      <span className="mb-5 flex h-16 w-16 items-center justify-center border-2 border-ink-20 text-ink-20">
        <Icon name="grid" size={28} />
      </span>
      <p
        className="mb-2 whitespace-pre-line text-center font-display text-ink"
        style={{ fontSize: 24, letterSpacing: -0.5, lineHeight: "24px" }}
      >
        {"NO TOURNAMENTS\nYET"}
      </p>
      <p
        className="mb-8 text-center font-mono text-[11px] text-ink-60"
        style={{ letterSpacing: 0.5 }}
      >
        Create your first tournament to start posting game assignments.
      </p>
      <Link
        href="/director/tournament/create"
        className="bg-ink px-8 py-4 text-paper hover:opacity-80"
      >
        <span className="font-mono-bold text-[11px] uppercase" style={{ letterSpacing: 2 }}>
          Create tournament →
        </span>
      </Link>
    </div>
  );
}
