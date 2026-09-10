"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { ZebraRule } from "@/components/ui/ZebraRule";
import { signInWithAppleOAuth, signInWithGoogleOAuth } from "@/lib/oauth";
import { getSupabaseSetupError, supabase } from "@/lib/supabase";

/**
 * Welcome — port of refee-mobile/refee/app/(auth)/welcome.tsx.
 * Inverse palette: ink canvas + paper text + hi-vis accents. The three-cell
 * value strip is the entire pitch: 48H / 0% / YOU set rate.
 */
export default function WelcomePage() {
  const router = useRouter();
  const [oauthLoading, setOauthLoading] = useState<"google" | "apple" | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);

  const runOAuth = async (provider: "google" | "apple") => {
    const setupErr = getSupabaseSetupError();
    if (setupErr) {
      setOauthError(setupErr);
      return;
    }
    setOauthError(null);
    setOauthLoading(provider);
    const { error } =
      provider === "google" ? await signInWithGoogleOAuth() : await signInWithAppleOAuth();
    setOauthLoading(null);
    if (error) setOauthError(error.message);
  };

  const goToSignIn = async () => {
    await supabase.auth.signOut();
    router.push("/auth/sign-in");
  };

  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <ZebraRule variant="signal" noMargin />

      <div className="flex flex-1 flex-col px-6 pb-6 pt-10">
        {/* Live tag */}
        <div className="mb-4 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-hi-vis" />
          <span
            className="font-mono-bold text-[10px] uppercase text-hi-vis"
            style={{ letterSpacing: 2 }}
          >
            Called up · Live roster
          </span>
        </div>

        <h1
          className="font-display text-paper"
          style={{ fontSize: 64, lineHeight: "72px", letterSpacing: -2.5 }}
        >
          REF<span className="text-signal-dark">EE</span>
          <br />
          EARN ON
          <br />
          YOUR <span className="text-signal-dark">CALL.</span>
        </h1>

        <p
          className="mb-8 mt-5 text-paper/70"
          style={{ fontSize: 15, lineHeight: "22px", maxWidth: 280 }}
        >
          The on-demand marketplace for officials. Find games, set your rate, get
          paid in 48 hours.
        </p>

        {/* Three-cell value strip */}
        <div className="mb-auto flex border border-paper/20">
          <ValueCell value="48" accent="H" label="Payout" bordered />
          <ValueCell value="0" accent="%" label="Ref fees" bordered />
          <ValueCell value="YOU" accent="." label="Set rate" />
        </div>
      </div>

      {/* Sticky footer */}
      <div
        className="border-t border-paper/15 bg-ink px-6 pt-4"
        style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom))" }}
      >
        <SocialAuthButtons
          variant="welcome"
          loading={oauthLoading}
          onGoogle={() => runOAuth("google")}
          onApple={() => runOAuth("apple")}
        />

        {oauthError ? (
          <p
            className="mt-3 font-mono text-[11px] uppercase text-foul"
            style={{ letterSpacing: 0.5 }}
          >
            {oauthError}
          </p>
        ) : null}

        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-paper/25" />
          <span
            className="font-mono-bold text-[10px] uppercase text-paper/45"
            style={{ letterSpacing: 3 }}
          >
            or phone
          </span>
          <span className="h-px flex-1 bg-paper/25" />
        </div>

        <button
          type="button"
          onClick={goToSignIn}
          className="mb-2.5 flex w-full items-center justify-center gap-2 bg-hi-vis py-5 text-ink hover:opacity-80"
        >
          <span className="font-mono-bold" style={{ fontSize: 13, letterSpacing: 2 }}>
            GET STARTED
          </span>
          <span className="font-mono-bold text-base">→</span>
        </button>

        <button
          type="button"
          onClick={goToSignIn}
          className="w-full border border-paper/30 py-4 text-center text-paper hover:opacity-70"
        >
          <span
            className="font-mono-bold uppercase"
            style={{ fontSize: 11, letterSpacing: 2 }}
          >
            Already a ref? <span className="text-hi-vis">Sign in</span>
          </span>
        </button>

        <div className="mt-5 flex justify-between">
          <span
            className="font-mono-bold text-[9px] uppercase text-paper/40"
            style={{ letterSpacing: 1.5 }}
          >
            v0.1
          </span>
          <span
            className="font-mono-bold text-[9px] uppercase text-paper/40"
            style={{ letterSpacing: 1.5 }}
          >
            ● Built by officials
          </span>
        </div>
      </div>
    </div>
  );
}

function ValueCell({
  value,
  accent,
  label,
  bordered,
}: {
  value: string;
  accent: string;
  label: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center py-3 ${
        bordered ? "border-r border-paper/20" : ""
      }`}
    >
      <span
        className="font-display text-paper"
        style={{ fontSize: 22, letterSpacing: -1, lineHeight: "22px" }}
      >
        {value}
        <span className="text-hi-vis">{accent}</span>
      </span>
      <span
        className="mt-1 font-mono-bold text-[8px] uppercase text-paper/50"
        style={{ letterSpacing: 1.5 }}
      >
        {label}
      </span>
    </div>
  );
}
