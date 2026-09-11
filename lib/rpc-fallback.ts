/**
 * The staffing RPCs — respond_to_job, director_respond_to_application,
 * complete_game, cancel_game — arrive with migration 0030. A database without
 * it (the hosted project, until the mobile release that ships 0030) answers
 * PGRST202, "Could not find the function".
 *
 * Callers then fall back to the direct table writes such a database still
 * permits, which is exactly what the live mobile app does today. Once 0030 is
 * applied everywhere these fallbacks never run and can be deleted — see
 * docs/PRODUCTION_CHECKLIST.md.
 */
export function isMissingRpc(
  error: { code?: string | null; message?: string | null } | null | undefined
): boolean {
  if (!error) return false;
  return (
    error.code === "PGRST202" ||
    error.code === "42883" ||
    /could not find the function/i.test(error.message ?? "")
  );
}
