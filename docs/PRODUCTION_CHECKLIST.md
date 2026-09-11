# Refee Web — production checklist

What stands between `main` and a working production site, in the order it
needs doing. Tick things off as they land.

## 1. Vercel — do now

- [ ] **Environment variables** (Project → Settings → Environment Variables → Production):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://rwqodozmniqjvkyjtcaw.supabase.co` (the hosted project the mobile app uses — same project means same accounts)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = the mobile app's `EXPO_PUBLIC_SUPABASE_ANON_KEY` (starts `sb_publishable_`)
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = the mobile app's `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_APP_ENV` = `production`
  - `NEXT_PUBLIC_SITE_URL` = the production domain (only needed once Google/Apple sign-in is on)
- [ ] **Redeploy after setting them.** `NEXT_PUBLIC_*` values are compiled into the build; saving them does nothing until the next deploy.
- [ ] **Node 22+** (Settings → General → Node.js Version). `@supabase/*` 2.116 requires Node >= 22.

## 2. Supabase (hosted) — before launch

- [ ] **Auth → URL Configuration:** add the production domain to Site URL / Redirect URLs, plus `https://<domain>/auth/callback`.
- [ ] **Phone auth** is on with real Twilio — verified. Test numbers (555-555-01xx) are local only.
- [ ] **Google / Apple sign-in** are off. To turn on: create the OAuth credentials, enable the providers, add the callback URL above. The web buttons already hide/explain themselves while off.

## 3. Database migration 0030 — ship with the mobile release (option 2)

The web app calls the staffing RPCs from migration `0030_staffing_rbac.sql`
(`respond_to_job`, `director_respond_to_application`, `complete_game`,
`cancel_game`). The hosted database is at 0029 and doesn't have them.

**Today:** the web app detects the missing functions and falls back to the
direct table writes the live mobile app uses (`lib/rpc-fallback.ts`). Accept,
decline, approve, complete and cancel all work on production in the meantime.

**Don't apply 0030 on its own.** It removes the direct-write permissions the
*released* mobile app depends on — accepting jobs and approving refs would
break in the mobile app until it ships the RPC version.

- [ ] Commit and push the mobile repo's pending work together: migrations `0030_staffing_rbac.sql` and `0031_schedule_import.sql`, and the matching app code that calls the RPCs.
- [ ] Release that mobile version.
- [ ] Apply 0030 and 0031 to the hosted database (`supabase db push`).
- [ ] Verify on production: a ref's accept becomes "pending" (organizer approval) instead of instantly accepted; the director Approvals tab approves.
- [ ] Afterwards: delete the `legacy*` fallbacks and `lib/rpc-fallback.ts` — they'll never run again.

Note: until 0030 is applied, production behaves like the mobile app does today —
a ref who accepts is confirmed immediately. The "awaiting approval" flow and
the auto-accept setting only take effect once 0030 is live.

## 4. Payments — charge at booking, pay out within 48h

Built and tested locally (Stripe test mode), not deployed. Details in the
mobile repo: `docs/PREPAY.md`.

- [ ] Decide how the backend work lands in the mobile repo (it touches the untracked `stripe-webhook/` and sits on top of 0030/0031).
- [ ] Apply migration `0032_prepay_on_create.sql` (after 0030/0031).
- [ ] Deploy functions: `supabase functions deploy prepay-game run-payouts stripe-webhook`.
- [ ] Create the two Vault secrets (`refee_functions_base_url`, `refee_service_role_key`) so the 15-minute payout job can run.
- [ ] Restore the web side: `git stash list` → "prepay-web: charge at booking" → `git stash pop`, verify, commit.
- [ ] Swap to **live** Stripe keys (publishable in Vercel, secret in Supabase function secrets) and point the Stripe webhook at production.

## 5. Assignor role

- [ ] Web assignor experience (in progress). Its staffing RPCs also come from 0030, so on production it depends on step 3.

## 6. Housekeeping

- [ ] Remove `legacy-peer-deps=true` from `~/.npmrc` — it hid the Stripe version conflict that broke every Vercel build after the payments merge.
- [ ] Local only: delete the two `PREPAY … TEST` games from the local database.
