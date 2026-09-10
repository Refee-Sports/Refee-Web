"use client";

import { Spinner } from "@/components/ui/AppButton";

type Props = {
  variant: "welcome" | "sign-in";
  loading: "google" | "apple" | null;
  onGoogle: () => void;
  onApple: () => void;
};

/** Port of the app's components/auth/SocialAuthButtons. */
export function SocialAuthButtons({ variant, loading, onGoogle, onApple }: Props) {
  const busy = loading !== null;
  const googleBorder =
    variant === "welcome" ? "border border-paper/25" : "border border-ink/25";

  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={onGoogle}
        disabled={busy}
        className={`flex items-center justify-center gap-2 bg-chalk py-4 text-ink disabled:opacity-60 ${googleBorder} hover:opacity-80`}
      >
        {loading === "google" ? (
          <Spinner />
        ) : (
          <span
            className="font-mono-bold uppercase"
            style={{ fontSize: 11, letterSpacing: 2 }}
          >
            Continue with Google
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={onApple}
        disabled={busy}
        className="flex items-center justify-center gap-2 bg-black py-4 text-white hover:opacity-80 disabled:opacity-60"
      >
        {loading === "apple" ? (
          <Spinner />
        ) : (
          <span
            className="font-mono-bold uppercase"
            style={{ fontSize: 11, letterSpacing: 2 }}
          >
            Continue with Apple
          </span>
        )}
      </button>
    </div>
  );
}
