/**
 * A stylized preview of the Refee app's job feed — pure CSS/markup, no image asset.
 * Mirrors the app's job card: live badge, pay figure, sport + location telemetry.
 */
export function PhoneMock() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Phone frame */}
      <div className="relative rounded-[38px] border-[3px] border-ink bg-dark-paper p-2.5 shadow-[10px_10px_0_rgba(8,17,28,0.9)]">
        {/* Screen */}
        <div className="overflow-hidden rounded-[28px] bg-paper">
          {/* status bar */}
          <div className="flex items-center justify-between bg-ink px-5 py-3 text-paper">
            <span className="font-mono text-[10px] uppercase tracking-widest">
              9:41
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="dot dot-pulse bg-hi-vis" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-hi-vis">
                On duty
              </span>
            </span>
          </div>

          {/* feed header */}
          <div className="px-5 pb-2 pt-4">
            <p className="kicker">Jobs near you · 3.2 mi</p>
            <h3 className="mt-1 font-display text-2xl font-black tracking-tight text-ink">
              12 open games
            </h3>
          </div>

          {/* job cards */}
          <div className="space-y-3 px-4 pb-5">
            <JobCard
              sport="Basketball"
              badge={{ label: "Live", tone: "live" }}
              title="U14 Rec — Court 2"
              meta="Sat 10:00 AM · Lincoln HS"
              pay="72"
            />
            <JobCard
              sport="Soccer"
              badge={{ label: "1 spot", tone: "signal" }}
              title="Adult Coed — Field A"
              meta="Sat 1:30 PM · Riverside Park"
              pay="65"
            />
            <JobCard
              sport="Baseball"
              badge={{ label: "Confirmed", tone: "confirmed" }}
              title="Little League — Diamond 4"
              meta="Sun 9:00 AM · Eastgate"
              pay="58"
              muted
            />
          </div>
        </div>
      </div>

      {/* Floating pay chip */}
      <div className="absolute -right-4 bottom-16 hidden rotate-3 border border-ink bg-hi-vis px-3 py-2 shadow-[4px_4px_0_var(--ink)] sm:block">
        <p className="font-mono text-[9px] uppercase tracking-widest text-ink">
          Paid out
        </p>
        <p className="font-display text-lg font-black tracking-tight text-ink">
          $1,284
        </p>
      </div>
    </div>
  );
}

function JobCard({
  sport,
  badge,
  title,
  meta,
  pay,
  muted = false,
}: {
  sport: string;
  badge: { label: string; tone: "live" | "signal" | "confirmed" };
  title: string;
  meta: string;
  pay: string;
  muted?: boolean;
}) {
  const badgeClass =
    badge.tone === "live"
      ? "badge-live"
      : badge.tone === "confirmed"
        ? "badge-confirmed"
        : "badge-signal";

  return (
    <div
      className={`card p-3.5 ${muted ? "opacity-60" : "shadow-[3px_3px_0_var(--ink)]"}`}
    >
      <div className="flex items-center justify-between">
        <span className="kicker">{sport}</span>
        <span className={`badge ${badgeClass}`}>
          {badge.tone !== "confirmed" && <span className="dot dot-pulse" />}
          {badge.label}
        </span>
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div>
          <p className="font-display text-base font-black leading-tight tracking-tight text-ink">
            {title}
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-60">
            {meta}
          </p>
        </div>
        <div className="text-right leading-none">
          <span className="font-display text-xl font-black tracking-tight text-court">
            ${pay}
          </span>
        </div>
      </div>
    </div>
  );
}
