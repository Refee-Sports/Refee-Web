/**
 * Supabase URL/key for the web client.
 *
 * These must point at the SAME Supabase project the mobile app uses
 * (refee-mobile/refee/.env.*: EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY) — that is
 * what lets a user sign in on either surface with one account.
 */
export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  };
}

export function isLocalSupabaseUrl(url: string): boolean {
  return /127\.0\.0\.1:54321|localhost:54321/.test(url);
}
