import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function isUnauthorizedError(err: unknown): boolean {
  if (!err) return false;
  const msg = err instanceof Error ? err.message : String(err);
  return /unauthorized|no authorization header|invalid token/i.test(msg);
}

/**
 * Centralized logout: clears all React Query caches and any auth-dependent
 * local state before signing out and redirecting. Prevents subsequent
 * server calls from being made with stale or missing auth.
 */
export async function signOutAndClear(
  queryClient: QueryClient,
  redirect: (path: string) => void,
  path = "/connexion",
) {
  try {
    queryClient.cancelQueries();
    queryClient.clear();
  } catch {
    // ignore cache errors
  }
  try {
    await supabase.auth.signOut();
  } catch {
    // ignore — we still want to redirect
  }
  redirect(path);
}