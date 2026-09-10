"use client";

import { ZebraRule } from "@/components/ui/ZebraRule";
import { Spinner } from "@/components/ui/AppButton";
import type { AssignmentStatus } from "@/lib/jobs/queries";

type Props = {
  assignmentStatus: AssignmentStatus;
  actionLoading: boolean;
  canMutate: boolean;
  onDecline: () => void;
  onAccept: () => void;
  onMessageCrew?: () => void;
  onWithdraw?: () => void;
};

/** Port of the app's JobDetailActionBar — one bar per assignment state. */
export function JobDetailActionBar({
  assignmentStatus,
  actionLoading,
  canMutate,
  onDecline,
  onAccept,
  onMessageCrew,
  onWithdraw,
}: Props) {
  const shell = "sticky bottom-0 z-10 border-t-[1.5px] border-ink bg-paper px-4 pt-3";
  const shellStyle = { paddingBottom: "calc(12px + env(safe-area-inset-bottom))" };

  if (assignmentStatus === "accepted") {
    return (
      <div className={shell} style={shellStyle}>
        <div className="-mt-[1.5px]">
          <ZebraRule variant="signal" thin noMargin />
        </div>
        <div className="mt-3 flex gap-2.5">
          <div className="flex flex-1 items-center justify-center border border-court bg-court/15 py-4">
            <span
              className="font-mono-bold text-xs uppercase text-court"
              style={{ letterSpacing: 2 }}
            >
              Accepted · On crew
            </span>
          </div>
          {onMessageCrew && (
            <button
              type="button"
              onClick={onMessageCrew}
              className="flex items-center justify-center bg-ink px-5 hover:opacity-80"
            >
              <span
                className="text-center font-mono-bold text-[10px] uppercase text-hi-vis"
                style={{ letterSpacing: 1.5 }}
              >
                MESSAGE
                <br />
                CREW
              </span>
            </button>
          )}
        </div>
        {onWithdraw && (
          <button
            type="button"
            onClick={onWithdraw}
            className="mt-2 w-full py-2 text-center hover:opacity-70"
          >
            <span
              className="font-mono-bold text-[9px] uppercase text-ink-40 underline"
              style={{ letterSpacing: 1.5 }}
            >
              Withdraw from this game
            </span>
          </button>
        )}
      </div>
    );
  }

  if (assignmentStatus === "needs_reconfirm") {
    return (
      <div className={shell} style={shellStyle}>
        <div className="-mt-[1.5px]">
          <ZebraRule variant="signal" thin noMargin />
        </div>
        <p
          className="mb-2.5 mt-3 text-center font-mono-bold text-[10px] uppercase text-foul"
          style={{ letterSpacing: 1.5 }}
        >
          ⚠ The organizer changed the time, venue, or pay
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onDecline}
            disabled={actionLoading || !canMutate}
            className="flex items-center justify-center border-[1.5px] border-foul px-4 py-4 hover:opacity-80 disabled:opacity-40"
          >
            <span
              className="font-mono-bold text-xs uppercase text-foul"
              style={{ letterSpacing: 1.4 }}
            >
              Drop out
            </span>
          </button>
          <button
            type="button"
            onClick={onAccept}
            disabled={actionLoading || !canMutate}
            className="flex flex-1 items-center justify-center gap-2 bg-court py-4 text-paper hover:opacity-90 disabled:opacity-40"
          >
            {actionLoading ? (
              <Spinner />
            ) : (
              <span className="font-mono-bold text-xs uppercase" style={{ letterSpacing: 1.4 }}>
                Re-confirm my spot →
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (assignmentStatus === "declined") {
    return (
      <div className={shell} style={shellStyle}>
        <div className="-mt-[1.5px]">
          <ZebraRule variant="signal" thin noMargin />
        </div>
        <div className="mt-3 flex items-center justify-center border border-ink-20 py-4">
          <span
            className="font-mono-bold text-xs uppercase text-ink-60"
            style={{ letterSpacing: 2 }}
          >
            Declined
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={shell} style={shellStyle}>
      <div className="-mt-[1.5px]">
        <ZebraRule variant="signal" thin noMargin />
      </div>
      <div className="mt-3 flex gap-2.5">
        <button
          type="button"
          onClick={onDecline}
          disabled={actionLoading || !canMutate}
          className="flex items-center justify-center border-[1.5px] border-foul px-4 py-4 hover:opacity-80 disabled:opacity-40"
        >
          <span
            className="font-mono-bold text-xs uppercase text-foul"
            style={{ letterSpacing: 1.4 }}
          >
            Decline
          </span>
        </button>
        <button
          type="button"
          onClick={onAccept}
          disabled={actionLoading || !canMutate}
          className="flex flex-1 items-center justify-center gap-2 bg-court py-4 text-paper hover:opacity-90 disabled:opacity-40"
        >
          {actionLoading ? (
            <Spinner />
          ) : (
            <>
              <span className="font-mono-bold text-xs uppercase" style={{ letterSpacing: 1.4 }}>
                Accept job
              </span>
              <span className="font-mono-bold text-base">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
