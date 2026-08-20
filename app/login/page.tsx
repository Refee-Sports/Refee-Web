import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Refee.",
};

/**
 * Placeholder login screen. Auth is not wired up yet — this is the future home
 * for Supabase Auth (email OTP / Apple sign-in) mirroring the mobile app.
 */
export default function LoginPage() {
  return (
    <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2">
          <Wordmark className="text-3xl" />
        </Link>

        <div className="mt-8 border border-ink bg-chalk p-8 shadow-[6px_6px_0_var(--ink)]">
          <span className="kicker">Account</span>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
            Log in
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-60">
            Login isn&apos;t available on the web just yet. For now, sign in
            through the Refee mobile app to manage your jobs, availability, and
            payouts.
          </p>

          {/* Disabled placeholder form — ready to wire to Supabase Auth */}
          <form className="mt-6 space-y-4 opacity-60" aria-disabled>
            <div>
              <label className="kicker mb-2 block">Email</label>
              <input
                type="email"
                disabled
                placeholder="you@example.com"
                className="w-full border border-ink bg-paper px-4 py-3 font-mono text-sm text-ink placeholder:text-ink-40"
              />
            </div>
            <button
              type="button"
              disabled
              className="btn btn-primary w-full cursor-not-allowed"
            >
              Continue — coming soon
            </button>
          </form>

          <Link
            href="/#download"
            className="mt-6 block text-center font-mono text-[11px] font-bold uppercase tracking-widest text-signal hover:underline"
          >
            Get the app instead →
          </Link>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center font-mono text-[11px] uppercase tracking-widest text-ink-60 hover:text-ink"
        >
          ← Back home
        </Link>
      </div>
    </main>
  );
}
