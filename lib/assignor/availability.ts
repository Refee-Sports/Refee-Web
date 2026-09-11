import { supabase } from "@/lib/supabase";

let cached: boolean | null = null;

/**
 * Whether this database can run the assignor role.
 *
 * Every assignor action is a migration-0030 RPC, and 0031 adds
 * tournaments.timezone, which the assignor screens read. The hosted project
 * has neither yet (see docs/PRODUCTION_CHECKLIST.md), so offering the role
 * there would sign people up to screens that can't do anything.
 *
 * A zero-row select of that column is a harmless probe: it errors only when
 * the column is missing. Migrations apply in order, so 0031 implies 0030.
 */
export async function fetchAssignorSupport(): Promise<boolean> {
  if (cached !== null) return cached;
  const { error } = await supabase.from("tournaments").select("timezone").limit(0);
  cached = !error;
  return cached;
}
